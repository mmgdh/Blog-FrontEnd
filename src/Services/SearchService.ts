import { ArticleSearch } from '../Entities/E_Search';
import { getAsync, post, Delete, put, getUri } from './_Service'

const controler = "Search";
export default class SearchService {
    public async SearchArticle(parames: any): Promise<any> {
        return await getAsync(controler + "/SearchArticle", parames)
    }
}