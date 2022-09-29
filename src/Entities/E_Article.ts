
export interface Article {
    id: string,
    title: string,
    content: string,
    html:string,
    classify: ArticleClassify,
    createDateTime: Date,
    tags: Array<ArticleTag>,
    pinYin: string,
    description:string,
    imageId:string
}

export interface ArticleTag {
    tagName: string,
    id: string,
    pinYin: string,
    articleCount:number
}

export interface ArticleClassify {
    id: string,
    classifyName: string,
    pinYin: string,
    articleCount: number,
    imgId:string
}

export interface ArticlePageRequest {
    page: number,
    pageSize: number,
    ClassifyIds: Array<string>,
    TagIds: Array<string>,
    CreateTime: Date
}
