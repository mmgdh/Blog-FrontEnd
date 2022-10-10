import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { ArticleTag, ArticleClassify, Article, ArticlePageRequest } from '../Entities/E_Article'
import ArticleService from '../Services/ArticleService'
import UploadService from "../Services/UploadService"
import { useAppStore } from './AppStore'
import { Empty } from 'ant-design-vue'


// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
var EmptyArticle =new Array<Article>()
EmptyArticle.push(new Article())
EmptyArticle.push(new Article())
export const useArticleStore = defineStore('Article', {
  state: () => {
    return {

      Tags: new Array<ArticleTag>,
      Classifies: new Array<ArticleClassify>,
      CurArticleCount: 0,
      CurPageArticles: new Array<Article>(),
      AllArticleCount: 0,
      PageRequestParm: new ArticlePageRequest(1,10),
      TopArticle: new Article(),
      RecommemtArticle: EmptyArticle
    }
  },
  actions: {
    async GetTags() {
      let ret = await ArticleService.prototype.GetAllArticleTags();
      this.Tags = ret;
    },
    async GetClassifies() {
      this.Classifies = await ArticleService.prototype.GetAllArticleClassify();
    },
    async GetArticleCount() {
      this.AllArticleCount = await ArticleService.prototype.GetArticleCount();
    },
    async GetArticleByPage() {
      var ret = await ArticleService.prototype.GetArticleByPage(this.PageRequestParm);
      this.CurPageArticles = ret.articles;
      this.CurArticleCount = ret.pageArticleCount ?? 0;
    },
    async GetIndexArticle() {
      const AppStore = useAppStore();
      var TopArticleId = await AppStore.GetParameterValueAsync('Blog-TopArticle');
      var strArticleId = await AppStore.GetParameterValueAsync('Blog-RcommentArticle');
      const ArticleIds = strArticleId?.split(',');
      if (ArticleIds && TopArticleId) {
        ArticleIds.push(TopArticleId)
        var ret = await ArticleService.prototype.GetArticlesById(ArticleIds);
        this.TopArticle = ret.find(x => x.id == TopArticleId?.toLowerCase()) ?? new Article;
        ArticleIds.pop()
        this.RecommemtArticle = ret.filter(x => ArticleIds.findIndex(y => y.toLocaleLowerCase() == x.id) > -1);
      }

    },
    ImgUrl(imgid: string) { return UploadService.prototype.getImageUri() + imgid }
  }
})