
# 安装ElasticSearch

docker pull elasticsearch:8.4.2

sudo docker run -d --name Blog-ElasticSearch -v /home/lqh/DockerData/ElasticSearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" --net myNetwork --ip 172.18.1.2  -e ES_JAVA_OPTS="-Xms64m -Xmx512m" elasticsearch:7.6.2


# 安装ElasticSearch-Head

docker pull mobz/elasticsearch-head:5

sudo docker run -d --name elasticsearch-head  --net myNetwork --ip 172.18.1.3 -p 9100:9100 mobz/elasticsearch-head:5

# elasticsearch.yml 配置
cluster.name: "docker-cluster"
network.host: 0.0.0.0
http.cors.enabled: true 
http.cors.allow-origin: "*"