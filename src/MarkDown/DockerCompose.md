# 背景
在之前的项目部署中，我都是将每一个服务一个个启动生成，很明显在微服务架构下，这种处理是不能接受的。而Docker-Compose就是官方用来管理和启动多项容器时用到的工具。
下面介绍学习使用过程中遇到的坑和最终效果

# 目的
使用Docker-Compose一键部署博客后端，并且设置其固定ip，挂载数据卷，且容器互通。服务内容包含：
1. Redis服务
2. Nginx服务
3. ElasticSearch服务
4. RabbitMQ服务
5. API服务

ps:未加入Sql服务，因为本博客需要通过Code First生成数据表，所以得先启动个Sql服务先。（前端服务将分成另一个Docker-Compose编写）
# 实现思路
## 如何实现容器使容器在同一网段并互通
Docker-Compose默认情况下会自动为编写内的容器实现互通，但为了更好的控制，我们可以新建一个NetWork，同一网段下的容器可通过ip互通
```
# 创建一个名为blognet的bridge网段，设定其网段范围为172.20.0.0/16
networks:
  blognet:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/16
```
若想使compose内容加到已有网段，可以如下,使用external加入到已经定义的mynet网段
```
networks:
  default: 
    external: 
      #使用自定义network
      name: mynet
```

## 如何固定容器的ip
可在容器编写块内部加上如下语句
```
#设置article-service容器的固定ip为172.20.0.10(在网段blognet里)
services:
  article-service:
    networks:
      blognet:
        ipv4_address: 172.20.0.10
```
## 如何设置环境变量
可填写environment，也可以指定env_file（默认好像就会读取.env文件，不过我这边还是都写上了）
编写如下：
```
    env_file:
      - .env
```
## 如何创建容器
创建容器可以通过 image直接从dockerhub拉取，也可以使用build，从定义好的dockerfile创建。

# 最终效果
```
# yaml 配置实例
version: '3'
services:
  redis:
    image: redis
    container_name: Blog-Redis
    restart: always
    volumes:
      - ./DockerVolumes/Redis/redis.conf:/etc/redis/redis.conf
      - ./DockerVolumes/Redis/data:/data
    command: /bin/sh -c "redis-server /etc/redis/redis.conf --appendonly yes" # 指定配置文件并开启持久化
    ports:
      - 6379:6379
    networks:
      blognet:
        ipv4_address: 172.20.1.1
  nginx:
    image: nginx
    container_name: Blog-Service-Nginx
    restart: always
    volumes:
      - ./DockerVolumes/Nginx/nginx.conf:/etc/nginx/nginx.conf
    ports:
      - 88:80
    networks:
      blognet:
        ipv4_address: 172.20.1.5
  rabbitmq:
    image: rabbitmq:management
    container_name: Blog-RabbitMQ
    restart: always
    ports:
      - 5672:5672
      - 15672:15672
    volumes:
      - ./DockerVolumes/RabbitMQ/data:/var/lib/rabbitmq
      # - ./DockerVolumes/RabbitMQ/conf:/etc/rabbitmq
    networks:
      blognet:
        ipv4_address: 172.20.1.6
  elastic-search:
    image: elasticsearch:7.6.2
    container_name: Blog-ElasticSearch
    volumes:
      - ./DockerVolumes/ElasticSearch/config:/usr/share/elasticsearch/config
      - ./DockerVolumes/ElasticSearch/data:/usr/share/elasticsearch/data
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    networks:
      blognet:
        ipv4_address: 172.20.1.7
        
  article-service:
    build:
      context: .
      dockerfile: Dockerfile-Article
    env_file:
      - .env
    networks:
      blognet:
        ipv4_address: 172.20.0.10
  bloginfo-service:
    build:
      context: .
      dockerfile: Dockerfile-BlogInfo
    env_file:
      - .env
    networks:
      blognet:
        ipv4_address: 172.20.0.20
  identity-service:
    build:
      context: .
      dockerfile: Dockerfile-Identity
    env_file:
      - .env
    networks:
      blognet:
        ipv4_address: 172.20.0.30
  search-service:
    build:
      context: .
      dockerfile: Dockerfile-Search
    env_file:
      - .env
    networks:
      blognet:
        ipv4_address: 172.20.0.40
  stream-service:
    build:
      context: .
      dockerfile: Dockerfile-Stream
    env_file:
      - .env
    networks:
      blognet:
        ipv4_address: 172.20.0.50

networks:
  blognet:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/16
  #可以自定义network名称，这里使用default表示如果不在service中单独配置就使用该设置 
  # default: 
  #   external: 
  #     #使用自定义network
  #     name: mynet

```

# 使用Docker-Compose后发现的好处
使用Docker-Compose生成，它会自动判断容器是否修改和生成，对已启动且未修改的容器，它会自动忽视，对修改了环境变量的容器，它会自动重启，对未生成的容器，它能识别并创建。


# 遇到的坑

## Docker-Compose在读取env环境变量的时候，无法读取多个带冒号的值：
### 情况：
```
Redis:A=123
Redis:B=456
Redis:C=789
```
在获取该内容值时，最终效果会是Redis=:C=789
### 结果
未能解决，只好将格式都改成Json格式换了方式获取

## 容器由于存在依存关系，在前置容器未生成时，先容器先生成导致失败。
### 情况
API容器依存RabbitMQ，由于RabbitMQ容器启动慢，导致API容器启动报错。
### 结果
有解决方法，但是好麻烦，反正RabbitMQ等支持服务基本不会关，就第一次启动的时候启动两次，暂不解决