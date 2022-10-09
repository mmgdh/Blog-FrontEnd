> 本文章讲解关于Asp.Net Core 里的知识点。

# DI（Dependency Injection,依赖注入）

DI 是一种开发模式，是控制反转IOC的具体实现，遵循设计模式的六大原则之依赖倒转原则（ISP） ：针对接口编程，依赖于抽象而不依赖于具体。

.Net Core框架自带了一个DI框架，nuget包（Microsoft.Extensions.DependencyInjection），官方包比较轻量，只支持构造器注入，不支持属性注入、以及方法注入。个人是偏好构造器注入的，所以不考虑添加其他DI框架。其他还有AspectCore、Autofac、Unity等实现了多种注入方式。

## 生命周期
生命周期分为三种： 
- 瞬态 Transient： 每一次从ServiceProvider取得，均返回一个新的实例。
- 作用域 Scope：在同一作用域下生成的实例相同，即同一个ServiceProvider下取得的实例相同。
- 单例 Singleton： 任意一个ServiceProvider下取得的实例都相同

解释：一个web请求发送到后端，结果了两个类处理，这两个类都有注入某个方法，那么Transient调用的两个方法都是新生成的。而Scope调用的两个方法是一个实例。
Singleton：在头一次调用后，后面每一次请求调用的实体都只会是这个。
记得还有一个注入方式，在程序启动的时候就注入，忘记哪里看到的，

## Filter（切面编程AOP）
Filter是MVC才有的，因为它的操作是在control上。

五种过滤器

1. Authorization Filter　授权过滤器用于确定当前请求用户是否被授权。
2. Resource Filter 资源过滤器是在授权之后第一个处理请求的过滤器，也是最后一个在请求离开过滤管道时接触请求的过滤器。在性能方面，对实现缓存或者对过滤管道进行短路 特别有用。
3. Action Filter 操作过滤器包装对单个操作方法的调用，并且可以处理传递到操作的参数以及从操作返回的操作结果。
4. Exception Filter 异常过滤器用于对 MVC 应用程序中未处理的异常应用全局策略。
5. Result Filter 结果过滤器包装单个操作结果的执行，并且尽在操作执行成功时运行。它们必须是围绕视图执行或格式化程序执行的逻辑的理想选择。

## 执行顺序
Authorization Filter：
Authorization是五种Filter中优先级最高的，通常用于验证Request合不合法，不合法后面就直接跳过。
Resource Filter：Resource是第二优先，会在Authorization之后，Model Binding之前执行。通常会是需要对Model加工处理才用。
Exception Filter：异常处理的Filter。
Action Filter：最常使用的Filter，封包进出都会经过它，使用上没什么需要特别注意的。跟Resource Filter很类似，但并不会经过Model Binding。
Result Filter：当Action完成后，最终会经过的Filter。

## 两种实现方式
1. 同步
```
    public class SampleActionFilter:IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            //操作执行前做的事情
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {
            //操作执行后做的事情
        }
    }
```
2. 异步
```
public class SampleAsyncActionFilter: IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //操作执行前做的事情
            await next();
            //操作执行后做的事情
        }
    }
```
注入
```
services.AddControllers(option =>
                option.Filters.Add(typeof(ExceptionFilter)))            
```
# Middle Ware （中间件）
中间件由前逻辑 next 后逻辑 三部分组成
每个Http请求都会经历一系列中间件的处理，最终形成Http响应报文返回到客户端
## 中间件的三个概念（Map，Use，Run）
Map 定义一个管道能处理哪些请求，Use和run来定义管道，一个管道由若干个USE和一个RUN组成，因为Run为执行最终核心逻辑，执行Run后的管道将不会传入消息到下个中间件。不在map定义管道内的use默认处理所有的请求

## 自定义中间件
中间件类是一个普通的.Net类，它不需要继承如何父类和任何接口，但需要有一个含有RequestDelegate类型参数的构造函数，这个参数用来指向下一个中间件，这个类还需要定义一个Invoke或InvokeAsync的方法，方法至少有一个HttpContext类型的参数，返回类型必须是Task,下面拿我在博客项目中使用的【获取每个请求内容和执行时间】中间件做例子

```
public class MyRecordMiddleWare
    {
        public readonly RequestDelegate _next;

        public readonly ILogger<MyRecordMiddleWare> logger;

        public MyRecordMiddleWare(RequestDelegate next, ILogger<MyRecordMiddleWare> logger)
        {
            _next = next;
            this.logger = logger;
        }


        public async Task Invoke(HttpContext context)
        {
            DateTime StartTime = DateTime.Now;
            await _next(context);
            info.actiontime = (DateTime.Now - StartTime).TotalSeconds;//执行时间差
            var json = JsonConvert.SerializeObject(info);
                logger.LogInformation(json);
        }
}
```

## 中间件和Filter的区别
中间件和filter所在的层级不同，中间件是ASP.Net Core提供的功能，而filter是ASP.NET Core MVC提供的功能。中间件能处理所有的请求，而Filter只能处理针对control的请求。