# 在Docker中使用Rabbitmq

### 用户操作
//进入容器
1. sudo docker exec -it rabbitmq /bin/bash
//查看用户
2.rabbitmqctl list_users
//删除guest用户，保留我新增的
3.rabbitmqctl delete_user guest