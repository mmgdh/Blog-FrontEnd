# 简介
>Redis（Remote Dictionary Server )，即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。

# 五大数据类型
## 1. String：字符串
string 类型是 Redis 最基本的数据类型,一个 key 对应一个 value，最大能存储 512MB。

## 2. Hash：适合存储对象
Redis hash 是一个 string 类型的 field 和 value 的映射表,(key=>value)对集合。

## 3. List：列表
简单的字符串列表，按照插入顺序排序,最多可存储 232 - 1 元素 (4294967295, 每个列表可存储40多亿)。

## 4. Set：集合（不可重复，无序）
 Set 是 string 类型的无序集合,不允许重复项

## 5. ZSET：有序集合
Set 的有序实现
# 缓存问题
## 缓存击穿
在热点缓存失效的瞬间有多个请求进来要求数据，导致数据库的压力激增。
### 解决方案
加锁，在进行数据库操作之前，通过setnx（set if not exists）来设置锁，如果成功则操作数据库，否则sleep while等待。

## 缓存穿透
一个不存在的缓存及数据库查不到的数据被进行查询，导致对数据库的不断访问。

### 解决方案
将查询为空的数据也存入缓存中，但是得设置过期时间。

## 缓存雪崩
由于缓存在同时的失效导致数据库的请求激增。

### 解决方案
设置随机延迟时间

# 持久化
##  AOF(Append Only File)  日志 操作记录
>AOF指的是Redis将每次的操作命令存到日志的持久化方式，这个记录只会记录写操作。
Redis 是先执行写操作命令后，才将该命令记录到 AOF 日志里的,这样可以避免而外的检查开销和不会拥堵当前写操作命令的执行，
但也产生了两个风险
1. Redis 在还没来得及将命令写入到硬盘时，服务器发生宕机了，这个数据就会有丢失的风险
2. 给「下一个」命令带来阻塞风险

在 redis.conf 配置文件中的 appendfsync 配置项可以有以下 3 种参数可填：

- Always，这个单词的意思是「总是」，所以它的意思是每次写操作命令执行完后，同步将 AOF 日志数据写回硬盘；
- Everysec，这个单词的意思是「每秒」，所以它的意思是每次写操作命令执行完后，先将命令写入到 AOF 文件的内核缓冲区，然后每隔一秒将缓冲区里的内容写回到硬盘；
- No，意味着不由 Redis 控制写回硬盘的时机，转交给操作系统控制写回的时机，也就是每次写操作命令执行完后，先将命令写入到 AOF 文件的内核缓冲区，再由操作系统决定何时将缓冲区内容写回硬盘。

如果要高性能，就选择 No 策略；
如果要高可靠，就选择 Always 策略；
如果允许数据丢失一点，但又想性能高，就选择 Everysec 策略。
![](http://118.195.172.226:88/FileUpload/GetImage?id=3d33f1ed-aba3-4204-913e-6d7a4fcfbc08)

### AOF 重写机制
 AOF 日志是一个文件，随着执行的写操作命令越来越多，文件的大小会越来越大。为了避免文件过大，Redis提供了AOF重写机制，当AOF文件的大小超过所设定的阈值后，Redis 就会启用 AOF 重写机制，来压缩 AOF 文件。

AOF 重写机制是在重写时，读取当前数据库中的所有键值对，然后将每一个键值对用一条命令记录到「新的 AOF 文件」，等到全部记录完后，就将新的 AOF 文件替换掉现有的 AOF 文件。

## RDB 数据记录

# 分布式锁

# 配置相关

# 哨兵模式

# 在 .Net Core 项目中使用Redis

## 1.在Linux上通过Docker运行redis容器

### 1.拉取redis镜像
```
//拉取最新版本
docker pull redis
//拉取指定版本
docker pull redis:6.0.8
```
### 2.整一份redis.conf文件并修改里面的配置
```
1.将bind 127.0.0.1 -::1注释掉
# bind 127.0.0.1 -::1
2.将 appendonly no 设置成yes,开启redis数据持久化 
 appendonly yes  
3.将  requirepass foobared 解开注释，设置密码
 requirepass root
```
### 3.放入自己的docker数据卷文件夹做好挂载的准备
### 4.启动容器
```
docker run  -p 6379:6379 --name myredis -v /home/lqh/DockerData/RedisConf/redis.conf:/etc/redis/redis.conf -v /home/lqh/DockerData/RedisConf/data:/data -d redis redis-server /etc/redis/redis.conf 
```
### 5.成功执行

## 在linux上通过Docker搭建redis主从复制
主 sudo docker run  -d -p 6379:6379 --network=myNetwork  --name Blog-Redis -v /home/lqh/DockerData/RedisConf/redis.conf:/etc/redis/redis.conf  redis redis-server /etc/redis/redis.conf
从 sudo docker run  -d -p 6380:6380 --network=myNetwork  --name Blog-Redis-Slave1 --link Blog-Redis:master -v /home/lqh/DockerData/RedisConf/redis-slave/redis.conf:/etc/redis/redis.conf  redis redis-server /etc/redis/redis.conf
从 sudo docker run  -d -p 6381:6381 --network=myNetwork  --name Blog-Redis-Slave2 --link Blog-Redis:master -v /home/lqh/DockerData/RedisConf/redis-slave2/redis.conf:/etc/redis/redis.conf  redis redis-server /etc/redis/redis.conf



### 2.在.Net Core 中使用redis
