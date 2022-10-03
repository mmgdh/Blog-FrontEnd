> 由于是微服务架构，服务与服务之间需要有消息队列进行通信，因此添加RabbitMQ。本文章介绍文章服务与文件服务之间的通讯，详细RabbitMQ文章请点击 [RabbitMQ]()

# 引用RabbitMQ
Nuget搜索 **RabbitMQ.Client** 下载合适的版本引入到新建的EventBus类库，该项目用的版本是6.4.0。后续服务项目统一引入EventBus。

# 编写RabbitMQ封装类库EventBus

## 1.对应IEventBus接口
该接口含有基础的发布和订阅方法
```
    public interface IEventBus
    {
        void publish(string eventName, object? eventData);

        void Subscribe(string eventName, Type handlerType);

        void Unsubscribe(string eventName, Type handlerType);
    }
```
## 2.编写RabbitMQEventBus
### 2.1 构造函数
 ```
    public RabbitMQEventBus(RabbitMQConnection rabbitMQConnection, IServiceScopeFactory serviceScopeFactory, string exchangeName, string queueName)
    {
        _exchangeName = exchangeName;
        _queueName = queueName;
        _rabbitMQConnection = rabbitMQConnection ?? throw new ArgumentNullException(nameof(rabbitMQConnection));
        this._subsManager = new SubscriptionsManager();
        this._serviceScope = serviceScopeFactory.CreateScope();
        this._serviceProvider = _serviceScope.ServiceProvider;
        this._consumerChannel = CreateConsumerChannel();
        this._subsManager.OnEventRemoved += SubsManager_OnEventRemoved;
    }
```
1. RabbitMQConnection：MQ连接配置
2. serviceScopeFactory：用于在接受到信息后注入服务
3. exchangeName：交换机名
4. queueName：消息队列名称

CreateConsumerChannel（）方法定义交换机和队列

### 2.2实现Subscribe订阅方法
```
    public void Subscribe(string eventName, Type handlerType)
    {
        CheckHandlerType(handlerType);
        DoInternalSubscription(eventName);
        _subsManager.AddSubscription(eventName, handlerType);
        StartBasicConsume();
    }
```
1. CheckHandlerType 判断类型是否继承自接口IIntegrationEventHandler
2. DoInternalSubscription 判断Event是否已经绑定，若没，则调用QueueBind绑定
3. AddSubscription 将处理方法Handler类型存入字典，在接受时调用
4. StartBasicConsume 若消费者未启动，则启动它

### 2.3 实现Publish 订阅方法
```
        public void publish(string eventName, object? eventData)
        {
            if (!_rabbitMQConnection.IsConnected)
            {
                _rabbitMQConnection.TryConnect();
            }
            //Channel 是建立在 Connection 上的虚拟连接
            //创建和销毁 TCP 连接的代价非常高，
            //Connection 可以创建多个 Channel ，Channel 不是线程安全的所以不能在线程间共享。
            using (var channel = _rabbitMQConnection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: _exchangeName, type: "direct");

                byte[] body;
                if (eventData == null)
                {
                    body = new byte[0];
                }
                else
                {
                    JsonSerializerOptions options = new JsonSerializerOptions
                    {
                        WriteIndented = true
                    };
                    body = JsonSerializer.SerializeToUtf8Bytes(eventData, eventData.GetType(), options);
                }
                var properties = channel.CreateBasicProperties();
                properties.DeliveryMode = 2; // persistent

                channel.BasicPublish(
                    exchange: _exchangeName,
                    routingKey: eventName,
                    mandatory: true,
                    basicProperties: properties,
                    body: body);
            }
        }
```
1. 判断是否已开启连接，未开启则开启
2. 定义管道，声明交换机
3. 将数据转为json字符串
4. 将DeliveryMode设为2（消息持久化）
5. 发布消息
## 编写注入方法

```
    public static IServiceCollection AddEventBus(this IServiceCollection services, string queueName,
        IEnumerable<Assembly> assemblies)
    {
        List<Type> eventHandlers = new List<Type>();
        foreach (var asm in assemblies)
        {
            //用GetTypes()，这样非public类也能注册
            var types = asm.GetTypes().Where(t => t.IsAbstract == false && t.IsAssignableTo(typeof(IIntegrationEventHandler)));
            eventHandlers.AddRange(types);
        }
        return AddEventBus(services, queueName, eventHandlers);
    }
    ///</param>
    /// <param name="eventHandlerTypes"></param>
    /// <returns></returns>
    public static IServiceCollection AddEventBus(this IServiceCollection services, string queueName, IEnumerable<Type> eventHandlerTypes)
    {
        foreach (Type type in eventHandlerTypes)
        {
            services.AddScoped(type, type);
        }
        var RabbitConfig= Environment.GetEnvironmentVariable("RabbitMqConfigure");
        if (RabbitConfig == null) throw new Exception("RabbitMq环境变量配置有误");
        var configure = JsonSerializer.Deserialize<RabbitMqConfigure>(RabbitConfig);

        services.AddSingleton<IEventBus>(sp =>
        {
            //如果注册服务的时候就要读取配置，那么可以用AddSingleton的Func<IServiceProvider, TService> 这个重载，
            //因为可以拿到IServiceProvider，省得自己构建IServiceProvider
            var optionMQ = sp.GetRequiredService<IOptions<IntegrationEventRabbitMQOptions>>().Value;
            var factory = new ConnectionFactory()
            {
                HostName = configure.IP,
                //HostName= "192.168.203.128",


                DispatchConsumersAsync = true,
                UserName = configure.User,
                Password = configure.PassWord
            };
            //eventBus归DI管理，释放的时候会调用Dispose
            //eventbus的Dispose中会销毁RabbitMQConnection
            RabbitMQConnection mqConnection = new RabbitMQConnection(factory);
            var serviceScopeFactory = sp.GetRequiredService<IServiceScopeFactory>();
            var eventBus = new RabbitMQEventBus(mqConnection, serviceScopeFactory, "mmgdh_Excahnge", queueName);
            //遍历所有实现了IIntegrationEventHandler接口的类，然后把它们批量注册到eventBus
            foreach (Type type in eventHandlerTypes)
            {
                //获取类上标注的EventNameAttribute，EventNameAttribute的Name为要监听的事件的名字
                //允许监听多个事件，但是不能为空
                var eventNameAttrs = type.GetCustomAttributes<EventNameAttribute>();
                if (eventNameAttrs.Any() == false)
                {
                    throw new ApplicationException($"There shoule be at least one EventNameAttribute on {type}");
                }
                foreach (var eventNameAttr in eventNameAttrs)
                {
                    eventBus.Subscribe(eventNameAttr.Name, type);
                }
            }
            return eventBus;
        });
        return services;
    }
```
1. 遍历程序集获取实现IIntegrationEventHandler接口的事件处理者Handler的类
2. 获取环境变量RabbitMQ的配置用于传入上面的RabbitMQEventBus
3. 创建RabbitMQ服务单例
4. 遍历传入的Handler类，获取其定义好的特性EventNameAttribe值，调用RabbitMQEventBus的subscribe订阅。

# 应用层使用RabbitMQ
## 定义继承了IIntegrationEventHandler的Handler处理类
```
    [EventName(ConstEventName.FileUpload)]
    public class FileUploadEventHandler : JsonIntegrationEventHandler<EventBusParameter.FileUpload_Parameter>
    {
        private readonly IUploadItemRepository repository;
        private IEventBus eventBus;
        private UploadDbContext dbContext;


        public FileUploadEventHandler(IUploadItemRepository repository, IEventBus eventBus, UploadDbContext dbContext)
        {
            this.repository = repository;
            this.eventBus = eventBus;
            this.dbContext = dbContext;
        }

        public override async Task HandleJson(string eventName, EventBusParameter.FileUpload_Parameter? eventData)
        {
            if (eventData == null) return;
            var FileMessage = eventData.UploadFile;
            var CallBAckMessage = eventData.CallBackNeed;
            var UploadType = eventData.UploadType;
            var bytes = ImageHelper.Base64ToImage(FileMessage.Base64);
            using Stream stream = new MemoryStream(bytes);
            FormFile formFile = new FormFile(stream, FileMessage.Offset, FileMessage.Length, FileMessage.Name, FileMessage.FileName);
            formFile.Headers = new HeaderDictionary();
            formFile.Headers.ContentType = FileMessage.ContentType;
            formFile.ContentType = FileMessage.ContentType;
            var ret = await repository.UploadFileAsync(UploadType,formFile);

            var CallBackEntity = new EventBusParameter.CallBackUpdateEntity(CallBAckMessage, ret.Id);
            await dbContext.SaveChangesAsync();
            eventBus.publish(CallBAckMessage.CallBackEventName, CallBackEntity);

        }
    }
```
1. 添加特性EventName，里面的值为公共变量字符串
2. 继承实现了IIntegrationEventHandler的JsonIntegrationEventHandler，使消息在接受的时候能由Json字符串转化为类
3. 实现处理方法Handle，剩下的就是逻辑操作，该例子实现了图片的接受转换，最终调入DI注入的repository，将图片保存到云存储

## 调用IEventBus，发布消息
```
        public static void EventBusFunc_UploadImg(EnumCallBackEntity enumCallBackEntity, string UploadImgType, IFormFile formFile,Guid MasterId,IEventBus eventBus)
        {
            var UploadFile = EventBusHelper.IFormFileToEventBusParameter(formFile);
            var CallBackNeed = new EventBusParameter.CallBackNeed(MasterId, enumCallBackEntity, ConstEventName.Article_FileCallBackUpdated);
            EventBusParameter.FileUpload_Parameter parameter = new EventBusParameter.FileUpload_Parameter(UploadImgType, UploadFile, CallBackNeed);
            eventBus.publish(ConstEventName.FileUpload, parameter);
        }
```
注入IEventBus，传入EventName对应的公共变量字符串和需要传递的参数，publish即可

## 服务注入
```
            var ret = configuration.GetSection("RabbitMqConfigure");
            services.Configure<IntegrationEventRabbitMQOptions>(configuration.GetSection("RabbitMqConfigure"));
            services.AddEventBus(initOptions.EventBusQueueName, assemblies);
```

program内，获取RabbitMQ配置参数和应用程序集，调用上面写好的注入方法