import { FriendLink } from '../Entities/E_FriendLink';
import { getAsync, post, Delete, put, getUri, get } from './_Service'

const controler = "FriendLink";
export default class FriendLinkService {
    public async AddFriendLink(parames: FriendLink): Promise<any> {
        return await post(controler + "/Add", parames)
    }
    public async DeleteFriendLink(guid: string): Promise<any> {
        return await Delete(controler + "/Delete", { id: guid })
    }
    public async ModifyFriendLink(parames: FriendLink): Promise<any> {
        return await put(controler + "/Modify", parames)
    }
    public async GetFriendLinkList(): Promise<any> {
        return await getAsync(controler + "/GetList")
    }
}