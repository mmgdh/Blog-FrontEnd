> 本文章参考以下链接，并结合自己的实战思考总结记录
1. https://mp.weixin.qq.com/s/pxHGM-hOJISEoBHGZch5Ag
2. https://baijiahao.baidu.com/s?id=1732891548341088166&wfr=spider&for=pc
3. 

# 简介
>RabbitMQ 2007 年发布，是使用 Erlang 语言开发的开源消息队列系统，基于 AMQP 协议来实现。

# AMQP协议
AMQP，即Advanced Message Queuing Protocol，一个提供统一消息服务的应用层标准高级消息队列协议，是应用层协议的一个开放标准，为面向消息的中间件设计。基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件不同产品，不同的开发语言等条件的限制。
## 协议里的重要概念
- **Server**：接收客户端的连接，实现AMQP实体服务。
- **Connection**：连接，应用程序与Server的网络连接，TCP长连接。
- **Channel**：信道，Channel是在Connection的基础上建立的虚拟连接，RabbitMQ中大部分的操作都是使用Channel完成的，比如：声明Queue、声明Exchange、发布消息、消费消息等。每个线程创建单独的Channel进行通讯，每个Channel都有自己的channel id帮助Broker和客户端识别Channel，所以Channel之间是完全隔离的。
Connection与Channel之间的关系可以比作光纤电缆，如果把Connection比作一条光纤电缆，那么Channel就相当于是电缆中的一束光纤。
- **Message**：消息，应用程序和服务器之间传送的数据，消息可以非常简单，也可以很复杂。由Properties和Body组成。
- **Properties** 外包装，可以对消息进行修饰，比如消息的优先级、延迟等高级特性；Body就是消息体内容。
- **Virtual Host**：虚拟主机，用于逻辑隔离。一个虚拟主机里面可以有若干个Exchange和Queue，同一个虚拟主机里面不能有相同名称的Exchange或Queue。
- **Exchange**：交换器，接收消息，消息到达RabbitMQ的第一站，按照路由规则将消息路由到一个或者多个队列。如果路由不到，或者返回给生产者，或者直接丢弃。RabbitMQ常用的交换器常用类型有direct、topic、fanout、headers四种。
- **Binding**：绑定，交换器和消息队列之间的虚拟连接，绑定中可以包含一个或者多个RoutingKey。
- **RoutingKey**：路由键，生产者将消息发送给交换器的时候，会发送一个RoutingKey，用来指定路由规则，这样交换器就知道把消息发送到哪个队列。路由键通常为一个“.”分割的字符串，例如“com.rabbitmq”。
- **Queue**：消息队列，用来保存消息，供消费者消费。
### AMQP工作原理
1. 生产者是连接到 Server，建立一个连接，开启一个信道。
2. 生产者声明交换器和队列，设置相关属性，并通过路由键将交 换器和队列进行绑定。
3. 消费者也需要进行建立连接，开启信道等操作，便于接收消息。
4. 生产者发送消息，发送到服务端中的虚拟主机。
虚拟主机中的交换器根据路由键选择路由规则，发送到不同的消息队列中。
5. 订阅了消息队列的消费者就可以获取到消息，进行消费。
![](http://118.195.172.226:88/FileUpload/GetImage?id=143ca3ff-8c0f-409e-9d01-f8c0f76c208c)

# 四种类型的Exchange交换机
## 1.direct

direct的意思是直接的，direct类型的Exchange会将消息转发到指定Routing key的Queue上，Routing key的解析规则为精确匹配。也就是只有当producer发送的消息的Routing key与某个Binding key相等时，消息才会被分发到对应的Queue上。简单点说就是一对一的，点对点的发送。
![](http://118.195.172.226:88/FileUpload/GetImage?id=dfad0c11-7961-4441-8896-8e566c04d3fb)
## 2.fanout
fanout是扇形的意思，该类型通常叫作广播类型。fanout类型的Exchange不处理Routing key，而是会将发送给它的消息路由到所有与它绑定的Queue上。简单点说就是发布订阅。
![](http://118.195.172.226:88/FileUpload/GetImage?id=f76b5db6-7bfd-4c30-843a-2ad9ef2d20a6)
## 3. topic
topic的意思是主题，topic类型的Exchange会根据通配符对Routing key进行匹配，只要Routing key满足某个通配符的条件，就会被路由到对应的Queue上。通配符有两种："*" 、 "#"。需要注意的是通配符前面必须要加上"."符号。

- *符号：有且只匹配一个词。比如 a.*可以匹配到"a.b"、"a.c"，但是匹配不了"a.b.c"。

- #符号：匹配一个或多个词。比如"rabbit.#"既可以匹配到"rabbit.a.b"、"rabbit.a"，也可以匹配到"rabbit.a.b.c"。

## 4.headers
不常用， headers Exchange中，Exchange与Queue之间的绑定不再通过Binding key绑定，而是通过Arguments绑定。

# 如何保障消息可靠
## 工作模式存在的问题——消息可能丢失
在RabbitMQ的工作模式中，一条消息从producer到达consumer要经过4个步骤，那么在这4步中，任何一步都可能会把消息丢掉：
1. 生产者将消息发送给Exchange交换机：假如producer向Exchange发送了一条消息，由于是异步调用，所以producer不关心Exchange是否收到了这条消息，就继续向下处理自己的业务逻辑。如果在Exchange收到消息之前，RabbitMQ宕机了，那这条消息就丢了。
![](http://118.195.172.226:88/FileUpload/GetImage?id=e17eb61f-eb2a-46b5-ab35-bd996c4a1685)
2. Exchange交换机接收到消息后，会根据producer发送过来的Routing key将消息路由到匹配的Queue队列中。如果匹配不到Routing key，Exchange虽然能收到消息，但无法将消息路由到Queue队列，那这条消息也算是变相消失了。
![](http://118.195.172.226:88/FileUpload/GetImage?id=733377ae-db3b-46a3-bd56-eede3ee5cc17)

3. 消息到达Queue中暂存，等待consumer消费：如果消息成功被路由到了Queue中，此时这条消息会被暂存在RabbitMQ的内存中，等到consumer消费，假如在consumer消费这条消息之前，RabbitMQ宕机了，那么这条消息也会丢失。
 ![](http://118.195.172.226:88/FileUpload/GetImage?id=ea693dd3-199a-435a-8636-edbc562a0133)
4. consumer从Queue中取走消息消费：如果前面一切顺利，并且消息也成功被consumer从Queue中取走消费，但consumer最后消费发生异常失败了。由于默认情况下，当一条消息被consumer取走后，RabbitMQ就会将这条消息从Queue中直接删除，所以，即使consumer消费失败了，这条消息也会消失，这样也会导致producer与consumer两个系统的数据不一致。
 ![](http://118.195.172.226:88/FileUpload/GetImage?id=f3d9a2bd-1c56-4b1e-8a85-20ff8cbbc899)

## 解决方案
### 1. 保证producer发送消息到RabbitMQ broker的可靠性
#### 1.Transaction模式
Transaction模式类似于我们操作数据库的操作，首先开启一个事务，然后执行sql，最后根据sql执行情况进行commit或者rollback。

在RabbitMQ中实现Transaction模式时，首先要用Channel对象的txSelect()方法将信道设置成事务模式，broker收到该命令后，会向producer返回一个select-ok的命令，表示信道的事务模式设置成功；然后producer就可以向broker发送消息了。在消息发送完成后，producer要调用Channel对象的commit()方法提交事务。producer只有收到了broker返回的Commit-Ok命令后才能提交成功，若在commit执行之前，RabbitMQ发生故障抛出异常，producer可以将其捕获，然后通过Channel对象的txRollback()方法回滚事务，同时可以重发该消息。

Transaction模式虽然可以保证消息从producer到broker的可靠性投递，但它的缺点也很明显，它是阻塞的，只有当一条消息被成功发送到RabbitMQ之后，才能继续发送下一条消息，这种模式会大幅度降低RabbitMQ的性能，不推荐使用。

#### 2. Confirm模式（推荐）
针对Transaction模式存在的浪费RabbitMQ性能的问题，RabbitMQ推出了Confirm模式。Confirm模式是一个异步确认的模式，producer发送一条消息后，在等待确认的过程中可以继续发送下一条消息。

要使用Confirm模式，首先要通过Channel对象的confirmSelec()方法将当前Channel设置为Confirm模式，然后，通过该Channel发布消息时，每条消息都会被分配一个唯一的ID（从1开始计数），当这条消息被路由到匹配的Queue队列之后，RabbitMQ就会发送一个确认(ack)给producer（如果是持久化的消息，那么这个确认(ack)会在RabbitMQ将这条消息写入磁盘之后发出），这个确认消息中包含了消息的唯一ID，这样producer就可以知道消息已经成功到达Queue队列了。

当RabbitMQ发生故障导致消息丢失，也会发送一个不确认(nack)的消息给producer，nack消息中也会包含producer发布的消息唯一ID，producer接收到nack的消息之后，可以针对发布失败的消息做相应处理，比如重新发布等。
![](http://118.195.172.226:88/FileUpload/GetImage?id=eabc1efa-e221-4a82-ad93-d4e359f20351)

使用异步确认方式
异步确认方式的实现原理是在将Channel设置为Confirm模式后，给该Channel添加一个监听ConfirmListener，ConfirmListener中定义了两个方法，一个是handleAck，用来处理RabbitMQ的ack确认消息，一个是handleNack，用来处理RabbitMQ的nack未确认消息，这两个方法会在RabbitMQ完成消息确认和发生故障导致消息丢失时回调，producer接收到回调时可以执行对应的回调处理。

### 2.保证Exchange路由消息到Queue的可靠性
#### 使用备胎Exchange交换机
所谓备胎交换机，是指当producer发送消息的Routing key不存在导致消息不可达时，自动将这条消息转发到另一个提前指定好的交换机上，这台交换机就是备胎交换机。备胎交换机也有自己绑定的Queue队列，当备胎交换机接到消息后，会将消息路由到自己匹配的Queue队列中，然后由订阅了这些Queue队列的消费者消费。

### 3.保证Queue消息的可靠性
消息到达Queue队列之后，在消费者消费之前，RabbitMQ宕机也会导致消息的丢失，所以，为了解决这种问题，我们需要将消息设置成持久化的消息。持久化消息会写入RabbitMQ的磁盘中，RabbitMQ宕机重启后，会恢复磁盘中的持久化消息。

但消息是存储于Queue队列中的，所以，只把消息持久化也不行，也要把Queue也设置成持久化的队列，这样，RabbitMQ宕机重启之后，Queue才不会丢失，否则，即使消息是持久化的，但Queue不是持久化的，那么RabbitMQ重启之后，Queue都不存在了，那么消息也就无处存放，也就相当于没了。

### 4.保证consumer消费消息的可靠性
consumer消费消息时，有一个ack机制，即向RabbitMQ发送一条ack指令，表示消息已经被成功消费，RabbitMQ收到ack指令后，会将消息从本地删除。默认情况下，consumer消费消息是自动ack机制，即消息只要到达consumer，就会向RabbitMQ发送ack，不管consumer是否消费成功。所以，为了保证producer与consumer数据的一致性，我们要使用手动ack的方式确认消息消费成功，即在消息消费完成后，通过代码显式调用发送ack。

consumer向RabbitMQ发送ack时有三种形式：

（1）reject：表示拒收消息。发送拒收消息时，需要设置一个 requeue 的参数，表示拒收之后，这条消息是否重新回到RabbitMQ的Queue之后，设置为true表示是，false表示否（消息会被删除）。若 requeue 设置为 true，那么消息回归原Queue之后，会被消费者重新消费，这样就会出现死循环，消费->拒绝->回Queue->消费->拒绝->回Queue......所以，一般设置为false。如果设置为true，那么最好限定消费次数，比如同一条消息消费5次之后就直接丢掉。

（2）nack：一般consumer消费消息出现异常时，需要发送nack给MQ，MQ接收到nack指令后，会根据发送nack时设置的requeue参数值来判断是否删除消息，如果requeue为true，那么消息会重新放入Queue队列中，如果requeue为false，消息就会被直接删掉。当requeue设置为true时，为了防止死循环性质的消费，最好限定消费次数，比如同一条消息消费5次之后就直接丢掉。

（3）ack：当consumer成功把消息消费掉后，需要发送ack给MQ，MQ接收到ack指令后，就会把消费成功的消息直接删掉。
# 补偿机制
由于某些不可控因素，也并不能保证100%的消息可靠性，只有producer明确知道了consumer消费成功了，才能100%保证两边数据的一致性。

因为MQ是异步处理，所以producer是无法通过RabbitMQ知道consumer是否消费成功了，所以，如果要保证两边数据100%一致，consumer在消费完成之后，要给producer发送一条消息通知producer自己消费成功了。

但producer不能一直在那干等着，如果consumer过了1小时还没有发送消息给producer，那么很可能是consumer消费失败了，所以，producer与consumer之间要根据业务场景定义一个反馈超时时间，并在producer后台定义一个定时任务，定时扫描超过指定时间未接收到consumer确认的消息，然后重发消息。重发消息的逻辑中，最好定义一个重发最大次数，比如重发3次后还是不行的话，那可能就是consumer有bug或者发生故障了，就停止重发，等待问题查明再解决。

既然producer可能会重发消息，所以，consumer端一定要做幂等控制（就是已经消费成功的消息不再次消费），要做到幂等控制，消息体中就需要有一个唯一的标识，consumer可以根据这个唯一标识来判断自己是否已经成功消费了这条消息。

# 实际运用
> 本博客项目使用RabbitMQ做消息队列，设置为direct模式和消息持久化，具体实现查看 [博客项目-使用RabbitMQ](http://www.mmgdh.cn/#/ShowArticle/520e4ae0-09a2-4542-81a9-f55850e11841)

### 用户操作
//进入容器
1. sudo docker exec -it rabbitmq /bin/bash
//查看用户
2.rabbitmqctl list_users
//删除guest用户，保留我新增的
3.rabbitmqctl delete_user guest