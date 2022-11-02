> MAUI全称为（Multi-platform App UI），是一个跨平台框架，用于使用 C# 和 XAML 创建本机移动和桌面应用。
使用 .NET MAUI，可以从单个共享代码库开发可在 Android、iOS、macOS 和 Windows 上运行的应用。

# 创建MAUI新程序

打开Visual Studio，新建项目找到.Net MAUI APP(若未找到说明VS没添加该功能，到选项里的功能里添加移动端开发)
创建后可以看到如下目录
![](http://118.195.172.226:88/FileUpload/GetImage?id=61d22e23-ada7-43a8-8563-fc50039760e8)

- App.xaml 文件包含应用范围的 XAML 资源，例如颜色、样式或模板。 
- App.xaml.cs 文件通常包含实例化 Shell 应用程序的代码。 在此项目中，它指向类 AppShell 。
- AppShell.xaml 用于定义应用的视觉层次结构的类。
- MainPage.xaml 展示页面，APPShell指向了该文件为启动项目
- MauiProgram 启动项，类似.Net Core的program，负责项目的启动和依赖注入，指明了App作为启动方法 
- Resources文件夹，资源文件夹，文件夹里的Styles文件夹有着Colors和Styles两个Xaml文件，可以定义全局颜色和样式 
- Platforms文件夹 针对多个平台的特殊设置（暂未学到）
- TestMAUI.csproj 配置项目基础的信息，类似标题，版本号等

# 添加MVVM架构实现效果
Nuget 安装官方MVVM支持包 CommunityToolKit.Mvvm 
创建ViewModel类MainViewModel继承ObservableObject（Mvvm包） 


```
//添加响应字段text和响应集合字段items，并使用ObservableProperty特性表示其为响应字段 
    [ObservableProperty] 
    ObservableCollection<string> items; 

    [ObservableProperty] 
    public string text; 

//添加响应方法Add和Delete，并使用RelayCommand代表其为响应方法 
    [RelayCommand] 
    void Add() 
    { 
        if (string.IsNullOrEmpty(Text)) 
            return; 
        Items.Add(Text); 
        Text = string.Empty; 
    } 
    [RelayCommand] 
    void Delete(string s) 
    { 
        if (items.Contains(s)) 
        { 
            Items.Remove(s); 
        } 
    } 
```
来到MainPage.xaml

首先在contentPage标签内添加xmlns:viewmodel="clr-namespace:TestMauiApp.ViewModel"，指明viewmodel为命名空间 

添加x:DataType="viewmodel:MainViewModel"指明命名空间下的哪个文件 

通过 Text=“{Binding Text}”指明输入框文本绑定MainViewModel里的text字段（MVVM包会将生成的字段改为大写抬头） 

通过 Command="{Binding AddCommand}" 给button添加点击事件效果 

通过 CommandParameter=“{Binding .}” 设置传参 

# 导航
新建 .Net MAUI ContentPage（XAML）项，取名为DetailViewModel 
在APPShell.xaml文件里添加路由 
```
Routing.RegisterRoute(nameof(DetailPage), typeof(DetailPage)); 
```
在Mainpage对应的ViewModel里添加点击跳转方法Tap 
```
    [RelayCommand] 
    async Task Tap(string s) 
    { 
        await Shell.Current.GoToAsync($"{nameof(DetailPage)}?Text={s}", 
            new Dictionary<string, object> 
            { 
                {nameof(DetailPage),new object() } 
            }); 
    } 
```
通过Shell.GoToAsync跳转到AppShell里配置的路由 

通过QuryString的方式传递参数 

在DetailViewModel里添加特性QueryProperty("Text","Text")获取传递值 

可通过await Shell.Current.GoToAsync("..");返回到上一层（和cd效果一致，../../表示上上一层的意思） 

# 公用API
MAUI里将多个平台的API集合成一个方便大家开发使用，举例网络连接API 

在ViewModel里添加Iconnectivity ,然后在MAUIProgram里将其注入 

在下面判断是否联网 
```
if (connectivity.NetworkAccess != NetworkAccess.Internet) 
{ 
    await Shell.Current.DisplayAlert("Un Oh!", "No Internet", "OK");  
} 
```