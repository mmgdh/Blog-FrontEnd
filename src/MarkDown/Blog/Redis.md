>本文章讲解Redis在该博客项目的使用，有关Redis相关的详细信息请点击 [Redis]()
# 使用场景
1. 博客信息服务BlogInfo内的博客参数为基本不变值，在服务端第一次获取后就应该存到缓存，减少数据库的负担
2. 文件服务StreamService从腾讯云存储获取图片，高频查询图片没必要每次都去腾讯云获取，可将其先存入缓存。
3. 对一些并发情况进行加锁防止并发bug，如参数更新后的redis缓存重载操作。

# 导入Redis
Nuget包搜索 **StackExchange.Redis** ，安装适合版本到对应RedisHelp封装类所在项目，该项目目前使用版本2.6.66

# 编写RedisHelper
## 构造函数
```
        public RedisHelper(IConnectionMultiplexer connectionMultiplexer)
        {
            this.connectionMultiplexer = connectionMultiplexer;
        }
```
connectionMultiplexer：传入的redis连接实例。

## Do方法
```
        private T Do<T>(Func<IDatabase, T> func)
        {
            var database = connectionMultiplexer.GetDatabase(DbNum);
            return func(database);
        }

        private void Do(Action<IDatabase> func)
        {
            var database = connectionMultiplexer.GetDatabase(DbNum);
            func(database);
        }
```
获取数据库并执行方法
## Redis锁
```
        public bool RedisLock<T>(string Key,TimeSpan? Timeduration,Func<T> func)
        {
            TimeSpan duration = Timeduration ?? TimeSpan.FromSeconds(30);
             var key = "RedisLock_" + Key;
            RedisValue token = Environment.MachineName;
            return Do(db =>
            {
                int Count = 10;
                while(Count>0)//测试10次获取，若失败则返回false
                {
                    if (db.LockTake(key, token, duration))//设置锁
                    {
                        try
                        {
                            CancellationTokenSource tokenSource = new CancellationTokenSource();
                            CancellationToken Cancletoken = tokenSource.Token;
                            //启动线程，保证服务能完成
                            Task.Run(() =>
                            {
                                while (true)
                                {
                                    if (Cancletoken.IsCancellationRequested)
                                    {
                                        break;
                                    }                                
                                   Thread.Sleep(duration / 5 * 4);
                                   db.LockExtend(key, token, duration);//重置时间
                                }
                            }, Cancletoken);
                            func.Invoke();//执行方法
                            tokenSource.Cancel();//关闭上面开启的任务
                        }
                        finally
                        {
                            db.LockRelease(key, token);//释放锁

                        }
                        return true;
                    }
                    else
                    {
                        Task.Delay(duration/10);
                        Count--;
                    }
                }
                return false;

            });

        }
```
1. 传入key值，过期时间，操作方法
2. 进入Do操作，定义最大获取次数10次
3. 进入循环，如果获取锁成功则进行操作，否则等待duration的十分之一时间再尝试
4. 若获取锁成功，开启线程，防止事务操作未完成锁就失效，传入Cancletoken
5. 执行方法，成功后告诉Cancletoken可取消任务
6. finally 释放锁

# 注入redis
```
      #region Redis
      string redisConnStr = configuration.GetValue<string>("Redis:ConnStr");
      IConnectionMultiplexer redisConnMultiplexer = ConnectionMultiplexer.Connect(redisConnStr);
      services.AddSingleton(typeof(IConnectionMultiplexer), redisConnMultiplexer);
      services.AddSingleton(new RedisHelper(redisConnMultiplexer));
      #endregion
```
1. 获取参数配置
2. 创建redis实例，添加Singleton注入
3. 创建RedisHelper类，也添加Singleton注入

# Redis缓存博客参数
```
        public async Task<List<BlogParamterResponse>> GetAllBlogParameters()
        {
            List<BlogParameter> blogParamters = new List<BlogParameter>();
            var redisRet = redisHelper.KeyExists(KeyName);
            if (redisRet)
            {
                blogParamters = await redisHelper.ListRangeAsync<BlogParameter>(KeyName);
            }
            else
            {
                blogParamters = await dbContext.blogParameters.ToListAsync();
                await redisHelper.ReSetRedisValue(KeyName, blogParamters, new Func<Task<List<BlogParameter>>>(async ()=> { return await dbContext.blogParameters.ToListAsync(); } ));
            }


            return BlogParamterResponse.CreatelstResponse(blogParamters);
        }
```
1. 判断缓存key是否存在，存在则直接从redis获取
2. 不存在，从数据库获取数据，调用方法存入redis