import { BlogParam } from '../Entities/E_BlogParam';
import { getAsync, get, post, Delete, put, getUri } from './_Service'

const controler = "BlogParameter";

export default class BlogInfoService {
    public async AddBlogParameter(parames: BlogParam): Promise<boolean> {
        return await post(controler + "/AddBlogParameter", parames)
    }

    public async DelBlogParameter(id: string): Promise<boolean> {
        return await Delete(controler + "/DelBlogParameter", { id: id })
    }

    public async ModifyBlogParameter(parames: BlogParam): Promise<boolean> {
        return await put(controler + "/ModifyBlogParameter", parames)
    }
    public async GetAllBlogParameters(): Promise<Array<BlogParam>> {
        return getAsync(controler + "/GetAllBlogParameters")
    }
    public async GetBlogParameters(): Promise<Array<BlogParam>> {
        return await getAsync(controler + "/GetBlogParameters")
    }

    public async GetBlogParameter(ParamName: string): Promise<BlogParam> {
        return await getAsync(controler + "/GetBlogParameter", { ParamName: ParamName })
    }

    public async RefreshBlogParameter(): Promise<boolean> {
        return await post(controler + "/RefreshBlogParameter")
    }

    getBlogInfoHubUri() {
        var ret = getUri() + "/" + 'SignalR' + "/BlogInfoHub";
        return ret;
    }
}