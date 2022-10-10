
export class Article {

    id: string = '';
    title: string = '';
    content: string = '';
    html: string = '';
    classify: ArticleClassify = new ArticleClassify();
    createDateTime: Date = new Date;
    tags: Array<ArticleTag> = new Array<ArticleTag>();
    pinYin: string = '';
    description = '';
    imageId = '';
}

export class ArticleTag {
    tagName: string = '';
    id: string = '';
    pinYin: string = '';
    articleCount: number = 0;
}

export class ArticleClassify {
    id: string = '';
    classifyName: string = '';
    pinYin: string = '';
    articleCount: number = 0;
    imgId: string = '';
}

export class ArticlePageRequest {
    constructor(_page:number,_pageSize:number){
        this.page=_page,
        this.pageSize=_pageSize
    }
    page = 1;
    pageSize = 9;
    ClassifyIds: Array<string> = new Array<string>()
    TagIds: Array<string> = new Array<string>()
    CreateTime: Date = new Date
}
