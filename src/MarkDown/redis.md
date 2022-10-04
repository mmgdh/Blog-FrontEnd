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
