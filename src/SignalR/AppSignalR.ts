import { AppstoreAddOutlined } from "@ant-design/icons-vue";
import * as signalR from "@microsoft/signalr";
import BlogInfoService from '../Services/BlogInfoService';
import { useAppStore } from '../Store/AppStore';

//禁用Negotiation，客户端一直连接初始的服务器，这样服务器搞负载均衡（不用Redis BackPlane等）也没问题
const AppStore =useAppStore();

const options = {
    skipNegotiation: true,
    transport: 1 // 强制WebSockets
};

const connection = new signalR.HubConnectionBuilder()
    .withUrl(BlogInfoService.prototype.getBlogInfoHubUri(), options)
    .build();
    connection.start();
connection.on("UpdateParameter", (paramId: string, paramValue: string) => {

    var index = AppStore.AllBlogParam.findIndex(x=>x.id==paramId)
    if(index>-1){
        AppStore.AllBlogParam[index].paramValue=paramValue
        console.log('SignalR',AppStore.AllBlogParam)
    }
    // console.log(paramValue)
});