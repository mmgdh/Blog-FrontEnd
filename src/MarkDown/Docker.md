# Docker 启动各项服务的语句

### 1.Redis
```
//拉取容器
Docker pull redis
//
docker run  -p 6379:6379 --name myredis -v /root/AppConfig/Redis/redis.conf:/etc/redis/redis.conf -v /root/AppConfig/Redis/data:/data -d redis redis-server /etc/redis/redis.conf 
原文链接：https://blog.csdn.net/qq_46122292/article/details/125003175
```



## docker 进入和退出容器
进入：docker exec -it 容器 /bin/bash
退出 exit



## 在 docker 中设置容器自动启动
```
1、使用 docker run 命令运行时

增加 --restart=always 参数即可

2、使用 docker-compose 命令运行时

在 yml 文件中，需要自启动的 service 下

增加 restart: always 项目即可

3、已运行的容器修改其自启动策略

执行命令：

docker update --restart=always 容器名或容器ID
```
参考地址：https://www.cnblogs.com/xwgli/p/16160972.html


# Portainer
docker run -d -p 9000:9000 --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /home/lqh/DockerData/portainer/Data:/data --name portainer portainer/portainer

# 搭建自定义网段
docker network create -d bridge --subnet 172.18.0.0/16 mynet
# 使用自定义网段
sudo docker run -d --name Blog-ArticleService --network=myNetwork  --env-file env  --ip 172.18.0.10 article-service
# 复制容器内文件
sudo docker cp SQLServer2:/var/opt/mssql /home/lqh/DockerData/sqlserver/bak/