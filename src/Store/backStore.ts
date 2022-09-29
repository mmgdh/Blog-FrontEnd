import { defineStore } from 'pinia'
import { ArticleTag, ArticleClassify, Article,ArticlePageRequest } from '../Entities/E_Article'
import ArticleService from '../Services/ArticleService'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useArticleStore = defineStore('backGroud', {
  state: () => {
    return {

      Tags: {

      } as Array<ArticleTag>,
      Classifies: {

      } as Array<ArticleClassify>,
      CurArticleCount: Number,
      CurPageArticles: {

      } as Array<Article>,
      PageRequestParm: {
        page: 1,
        pageSize: 10,
        ClassifyIds: [] ,
        TagIds: [] ,
        CreateTime:{} as Date
      } as ArticlePageRequest
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
    // async GetArticleCount() {
    //   this.AllArticleCount = await ArticleService.prototype.GetArticleCount();
    // },
    async GetArticleByPage() {
      var ret  = await ArticleService.prototype.GetArticleByPage(this.PageRequestParm);
      this.CurPageArticles=ret.articles;
      this.CurArticleCount=ret.pageArticleCount;
    }
  }
})