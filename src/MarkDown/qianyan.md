> 欢迎来到我的博客项目，本博客用于个人技术分享与生活记录，目前还在开发中，只有主要的文章浏览和编辑功能，后续会持续更新，加入更多新功能和效果。
本篇文章为导引文，概览该博客系统开发用到的技术，会持续更新。

# 特别感谢

首先在此特别感谢 微软MVP杨中科杨老师 的课程视频，该视频是我在bilibil看到的最贴合我意的.Net Core 微服务 技术教程视频，并且也出了相应的书，我也第一时间入手了，在视频和书本的帮助下进行开发，解决了很多本来有可能遇到的难点，少走了很多弯路，并一步步学习而来。
还要感谢网民 花未眠 的大二学生的博客开源分享，在我苦恼博客页面样式的时候，加入了许多的博客技术群，发现这个宝藏。由于我的前端CSS极其薄弱，一开始自己开发的样式可以说是惨不忍睹，是他的开源分享拯救了我的博客页面，拨开了我对CSS完全不了解的雾霾，也让我知道了一个大二学生就有如此技术，自己更应该加紧学习。
还有其他我在学习路上帮到我的up主，再次统一感谢分享，我也在此罗列下我还记得的一些学习视频与地址。
1. .Net6整体学习=》 杨老师的.Net6 开发: https://www.bilibili.com/video/BV1pK41137He/
2. 博客样式参考=》 花未眠的个人博客: https://www.linhaojun.top/
3. .Net Core与EF Core 入门 =》微软MVP杨旭 ：https://space.bilibili.com/361469957/video?tid=0&page=2&keyword=&order=pubdate
4. Vue 3 入门 =>不知名up https://www.bilibili.com/video/BV1W34y1i7cG
5. redis,Docker,ElasticSearch =>狂胜说 https://space.bilibili.com/95256449
6. CSDN 掘金
---

# 后端搭建
> 后端开发使用.Net 6 作为开发框架，C#为编程语言，用DDD领域驱动为设计理念开发微服务，EF Core做数据库ORM，使用Redis，RabbitMQ，SignalR，ElasticSearch，JWT，云存储等前沿技术开发。
## 服务拆分
说实在对DDD的了解还是很模糊，不过尽量以领域的概念，还是将服务拆分为了以下四个
1. 文章服务 管理博文的内容与信息，只负责文章的存储的查询
2. 身份认证服务 使用Asp.NetCore.Identity库，负责身份认证
3. 文件服务 管理所有的文件上传和获取，目前只考虑了图片的情况，用腾讯云存储做云服务器
4. 博客参数服务 管理博客的参数信息

后续还会加入日志服务，目前的日志还只是打印到console里，在docker里查看，很麻烦。再然后会根据更新情况加入对应所需要的服务
## 使用EF Core
## 使用RabbitMQ进行服务间的通信
## 使用Redis做缓存和锁
## 使用Identity做身份认证
## 使用SignalR做服务端对客户端的请求
## 使用腾讯云存储做图床存储

# 前端搭建
> 前端开发使用Vue3+Vite+TypeScript作为主框架，AntDesignVue做组件库， Less做CSS预处理语言，使用Pinia，axios等主流js库，MarkDown控件选用md-editor-v3。目前后台管理和博客页面未拆分，还是由于自己的前端经验不足导致开始的时候没考虑到，后续将拆分成两个。

## 博客主界面

## 后台管理界面



# 服务部署
> 云服务器选用腾讯云服务，服务器系统为 CentOS 7.6 64位，配置为标准型S5 - 2核 4G，所有服务都用Docker进行部署，使用MobaXterm进行连接。

## 