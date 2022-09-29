import {get,post,getUri} from './_Service'

const controler = "FileUpload";

export default class UploadService{
    async UploadImg(parames:FormData,timeout:number=10000){
       return await post(controler+"/Upload",parames,timeout);
    }

    async GetImg(ImgId:string){
        return await get(controler+"/GetImage",ImgId);
    }

    getImageUri(){
        var ret =getUri()+"/"+controler+"/GetImage?id=";
        return ret;
    }
}
