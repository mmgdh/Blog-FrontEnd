import { ArticleSearch } from '../Entities/E_Search';
import { get, post, Delete, put, getUri } from './_Service'

const controler = "Search";
export default class SearchService {
    public async SearchArticle(parames: any): Promise<any> {
        return await get(controler + "/SearchArticle", parames)
    }
}