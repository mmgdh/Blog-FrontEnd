interface ISearch {
    id: string,
}


export interface ArticleSearchResponse {
    id: string
    content: string
    Title: string
}


export class ArticleSearch {
    keyword = '';
    pageSize = 10;
    pageIndex = 1;
}