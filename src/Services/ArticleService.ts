import { getAsync, post, Delete, put } from './_Service'
import { Article, ArticleTag } from '../Entities/E_Article'


const controler = "Article";

export default class ArticleService {

    async AddArticle(Article: FormData) {
        return await post(controler + '/Add', Article)
    }

    async ModifyArticle(Article: FormData) {
        return await put(controler + '/Modify', Article)
    }

    async DeleteArticle(ArticleId: string) {
        return await Delete(controler + '/Delete', { id: ArticleId })
    }

    async AddArticleTag(TagName: string) {
        return await post(controler + "/AddTag", { tagName: TagName })
    }
    async DeleteArticleTag(TagId: string) {
        return await Delete(controler + "/DeleteTag", { id: TagId })
    }
    async ModifyrticleTag(articleTag: ArticleTag) {
        return await put(controler + "/ModifyTag", articleTag)
    }

    async ModifyArticlCLassify(articleClassify: FormData) {
        return await put(controler + "/ModifyCLassify", articleClassify)
    }
    async AddArticleClassify(articleClassify: FormData) {
        return await post(controler + "/AddClassify", articleClassify)
    }
    async DeleteArticleClassify(ClassifyId: string) {
        return await Delete(controler + "/DeleteClassify", { id: ClassifyId })
    }


    //Get请求
    public async GetArticleById(_id: string, _needContent: boolean = false, _needHtml: boolean = false) {
        return await getAsync(controler + "/GetArticleById", { id: _id, needContent: _needContent, needHtml: _needHtml })
    }

    public async GetArticlesById(_id: string[], _needContent: boolean = false, _needHtml: boolean = false):Promise<Article[]> {
        return await getAsync(controler + "/GetArticlesById", { ids: _id, needContent: _needContent, needHtml: _needHtml })
    }

    async GetAllArticleTags() {
        return await getAsync(controler + '/GetAllTags', { NeedCount: true })
    }

    async GetArticleByPage(parames: any) {
        return await getAsync(controler + '/GetArticleByPage', parames);
    }

    public async GetAllArticleClassify() {
        return await getAsync(controler + '/GetAllArticleClassify')
    }

    public async GetArticleCount() {
        return await getAsync(controler + '/GetArticleCount');
    }

}
