import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ArticleTag, ArticleClassify, Article, ArticlePageRequest } from '../Entities/E_Article'
import ArticleService from '../Services/ArticleService'
import UploadService from "../Services/UploadService"
import { useAppStore } from './AppStore'


// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
const ArticleArray: Article[] = [];
const TopArticleTemp:any=undefined;
const RecommondArticleTemp:any=undefined;
let _TopArticle= ref(TopArticleTemp);
let _RecommemtArticle= ref(RecommondArticleTemp)
export const useArticleStore = defineStore('Article', {
  state: () => {
    return {

      Tags: {

      } as Array<ArticleTag>,
      Classifies: {

      } as Array<ArticleClassify>,
      CurArticleCount: 0,
      CurPageArticles: ArticleArray,
      AllArticleCount: 0,
      PageRequestParm: {
        page: 1,
        pageSize: 10,
        ClassifyIds: [],
        TagIds: [],
        CreateTime: {} as Date
      } as ArticlePageRequest,
    }
  },
  getters: {
    TopArticle: (state): Article=> {
      if(_TopArticle.value){
        return _TopArticle.value
      }
      return state.CurPageArticles[0];
    },
    RecommemtArticle: (state): Article[] => {
      if(_RecommemtArticle.value){
        return _RecommemtArticle.value
      }
      return state.CurPageArticles.slice(0, 2);
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
        _TopArticle.value =ret.find(x=>x.id==TopArticleId?.toLowerCase());
        ArticleIds.pop()
        _RecommemtArticle.value=ret.filter(x=>ArticleIds.findIndex(y=>y.toLocaleLowerCase()==x.id)>-1);
      }

    },
    ImgUrl(imgid: string) { return UploadService.prototype.getImageUri() + imgid }
  }
})