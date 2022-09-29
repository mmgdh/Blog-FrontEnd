import { UserLogin, User } from '../Entities/E_Users';
import { post } from './_Service'

const controler = "Login";

export default class UserLoginService {
    public async Login(parames: UserLogin): Promise<string> {
        var ret = await post(controler + "/LoginByUserNameAndPwd", parames)
        if (ret.msg)
            return '';
        else
            return ret;
    }
}