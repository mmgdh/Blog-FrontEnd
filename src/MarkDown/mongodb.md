# 安装
docker pull mongo

docker run -itd --name mongo -v E:\DockerVolume\mongoDB:/data/db -p 27017:27017 mongo --auth

 docker exec -it mongo mongo admin


db.createUser({ user:'root',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'},'readWriteAnyDatabase']});

