> 本文章讲解ElasticSearch在博客中的使用，从而实现文章快速搜索的功能。
使用库：NEST（7.17.4）
具体ElasticSearch博文等待编辑。。
目前尚未使用IK分词器，查询不算狠流畅，后续添加

# 创建服务项
由于搜索功能不针对某一具体领域，所以将其拆分出作为一个新的微服务，专门提供elasticSearch搜索服务。

## 创建基础设施层，编写方法类。
```
        using Nest;

        private readonly IElasticClient elasticClient;

        public SearchRepository(IElasticClient elasticClient)
        {
            this.elasticClient = elasticClient;
        }

        public Task DeleteAsync(ArticleSearch search)
        {
            return elasticClient.DeleteAsync(new DeleteRequest(search.searchType, search.Id));
        }

         public async Task UpsertAsync(ArticleSearch search)
        {

            var response = await elasticClient.IndexAsync(search, idx => idx.Index(search.searchType.ToLower()).Id(search.Id));//Upsert:Update or Insert
            if (!response.IsValid)
            {
                throw new ApplicationException(response.DebugInformation);
            }
        }

        public async Task<SearchResponse> SearchAsync(string searchType, string Keyword, int PageIndex, int PageSize)
        {
            int from = PageSize * (PageIndex - 1);
            string kw = Keyword;
            Func<QueryContainerDescriptor<ArticleSearch>, QueryContainer> query = (q) =>
              q.Match(mq => mq.Field(f => f.Title).Query(kw))
              || q.Match(mq => mq.Field(f => f.Content).Query(kw));
            Func<HighlightDescriptor<ArticleSearch>, IHighlight> highlightSelector = h => h
                .Fields(fs => fs.Field(f => f.Content));
            var result = await this.elasticClient.SearchAsync<ArticleSearch>(s => s.Index(ConstSearchType.ConstSearchArticle).From(from)
                .Size(PageSize).Query(query).Highlight(highlightSelector));
            if (!result.IsValid)
            {
                throw result.OriginalException;
            }
            List<ArticleSearch> articles = new List<ArticleSearch>();
            foreach (var hit in result.Hits)
            {
                string highlightedSubtitle;
                highlightedSubtitle = string.Join("\r\n", hit.Highlight["content"]);
                var article = hit.Source with { Content = highlightedSubtitle };
                articles.Add(article);
            }
            return new SearchResponse(articles, result.Total);
        }
```
实现了 新增或更新（Update），删除（Delete），搜索（search）三个功能
### 1. 新增或更新

IElasticClient 提供API IndexAsync，该方法发送put请求到elasticSearch服务，第一个参数为保存的内容，第二个参数为保证的索引名（可以理解为数据库的表明，给后面搜索的时候用），第三个为这条记录的唯一Id。

### 2. 删除

IElasticClient 提供删除API DeleteAsync 发送Delete请求，传递参数为Index和id（索引名和唯一主键）

### 3. 搜索
搜索API  SearchAsync 发送Post请求，传递
- Query：编写查询语句，Match为匹配项，指明哪个filed（字段）去查询匹配对应kw（搜索值），可以||代表或者来进行多字段匹配。本例中匹配了标题和内容。
- highlightSelector 指向查询结果显示哪个搜索字段内容并显示高亮。会在内容中添加<em></em>，前端可修饰
- from： 从第几页开始
- size： 搜索多少条数据

生成返回的实体进行返回到前端操作。

# 注入服务
```
            services.AddScoped<IElasticClient>(sp =>
            {
                var ElasticSearchUrl = Environment.GetEnvironmentVariable("ElasticSearchUrl");
                //var option = sp.GetRequiredService<IOptions<ElasticSearchOptions>>();
                var settings = new ConnectionSettings(new Uri(ElasticSearchUrl));
                return new ElasticClient(settings);
            });
            services.AddScoped<ISearchRepository, SearchRepository>();
```
将ElasticClient和我们自己封装的repository都注入。

# API编写
```
        [HttpGet]
        public Task<SearchResponse> SearchArticle([FromQuery]ArticleSearchRequest request)
        {
            return repository.SearchAsync(ConstSearchType.ConstSearchArticle, request.keyword,request.pageIndex,request.pageSize);
        }
```
 前端传入对应的传参调用API即可

----
# 效果演示

![](http://118.195.172.226:88/FileUpload/GetImage?id=2340f9c8-2a36-4e7d-a122-6d72b64789f6)