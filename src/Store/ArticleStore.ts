import {ref} from 'vue'
import { defineStore } from 'pinia'
import { ArticleTag, ArticleClassify, Article, ArticlePageRequest } from '../Entities/E_Article'
import ArticleService from '../Services/ArticleService'
import UploadService from "../Services/UploadService"
import { useAppStore } from './AppStore'


// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
const ArticleArray:Article[]=[];

export const useArticleStore = defineStore('Article', {
  state: () => {
    return {

      Tags: {

      } as Array<ArticleTag>,
      Classifies: {

      } as Array<ArticleClassify>,
      CurArticleCount: Number,
      CurPageArticles: ArticleArray,
      AllArticleCount: Number,
      PageRequestParm: {
        page: 1,
        pageSize: 10,
        ClassifyIds: [],
        TagIds: [],
        CreateTime: {} as Date
      } as ArticlePageRequest
    }
  },
  getters: {
    FeatureArticle: async (state): Promise<Article> => {
      const AppStore = useAppStore();
      var TopArticleId = await AppStore.GetParameterValue('Blog-TopArticle');
      if(TopArticleId){
        return await ArticleService.prototype.GetArticleById(TopArticleId);
      }
      console.log('3'+TopArticleId)
      return state.CurPageArticles[0];
    },
    RecommemtArticle:async (state):Promise<Article>=>{
      const AppStore = useAppStore();
      var strArticleId = await AppStore.GetParameterValue('Blog-RcommentArticle');
      const ArticleIds =strArticleId?.split(',');
      if(ArticleIds){
        return await ArticleService.prototype.GetArticlesById(ArticleIds);
      }
      return state.CurPageArticles[0];
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
      this.CurPageArticles= ret.articles;
      this.CurArticleCount = ret.pageArticleCount ?? 0;
    },
    ImgUrl(imgid: string) { return UploadService.prototype.getImageUri() + imgid }
  }
})