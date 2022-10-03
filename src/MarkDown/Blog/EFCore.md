> 本内容使用文章服务 ArticleService 作为例子讲解EF Core在本项目中的具体使用，详细EF Core 博文请点击 [EF Core]()
对应的数据库为Sql Server
 AggregateRootEntity为聚合根实体，继承BaseEntity，BaseEntity含有唯一主键GuidId。实体为充血模型，含有create方法构建实体类。
实体类关系如下
>1. Article和ArticleTag:多对多
2. Article和ArticleClassify:多对一
3. Article和ArticleContent:一对一

# 项目引入
Nuget包搜索Microsoft.EntityFrameworkCore.SqlServer，搜索后安装合适版本到实体类库，当前博客用的是6.0.8版本。
Nuget包搜索Microsoft.EntityFrameworkCore.tools，搜索后安装与上面同样版本到DbContext所在的构建库。


# Domian层
## 创建实体类
```
    public class Article : AggregateRootEntity
    {
        private string _Title = "";
        /// <summary>
        /// 标题
        /// </summary>
        public string Title
        {
            get
            {
                return _Title;
            }
            set
            {
                _Title = value;
                PinYin = PinYinHelper.GetFrist(value);
            }
        }
        public ArticleClassify Classify { get; set; } = new ArticleClassify();

        public Guid ImageId { get; set; }

        public string? Description { get; set; }

        public string PinYin { get; private set; } = "";
        /// <summary>
        /// 文章内容
        /// </summary>
        public ArticleContent articleContent { get; set; } = new ArticleContent();
        /// <summary>
        /// 文章MarkDown Html内容
        /// </summary>
        public ArticleHtml articleHtml { get; set; } = new ArticleHtml();
        /// <summary>
        /// 标签
        /// </summary>
        public List<ArticleTag> Tags { get; set; } = new List<ArticleTag>();



        public static Article Create(string Title, string Content,string html)
        {
            var article = new Article();
            article.Title = Title;
            article.articleContent = ArticleContent.Create(article, Content);
            article.articleHtml = ArticleHtml.Create(article, html);
            article.SetContent(Content);
            return article;
        }

        public void SetContent(string Content)
        {
            this.Description = RegexHelper.GetContent(Content, 200);
        }
    }
```
---
```
    public class ArticleTag:BaseEntity
    {
        private string _TagName = "";
        public string TagName
        {
            get
            {
                return _TagName;
            }
            set
            {
                _TagName =value;
                PinYin = PinYinHelper.GetFrist(value);
            }
        }

        public string PinYin { get; private set; } = "";
        public List<Article> Articles { get; set; } = new List<Article>();

        public static ArticleTag Create(string TagName)
        {
            return new ArticleTag
            {
                TagName = TagName
            };
        }

    }
```
****
```
    public class ArticleClassify : BaseEntity
    {
        private string _ClassifyName = "";
        /// <summary>
        /// 标题
        /// </summary>
        public string ClassifyName
        {
            get
            {
                return _ClassifyName;
            }
            set
            {
                _ClassifyName = value;
                PinYin = PinYinHelper.GetFrist(value);
            }
        }
        public string PinYin { get; private set; } = "";
        public List<Article> Articles { get;  set; } = new List<Article>();

        public Guid? DefaultImgId { get; set; }


        public static ArticleClassify Create(string Name,Guid? DefaultImgId)
        {
            ArticleClassify articleClassify = new ArticleClassify();
            articleClassify.ClassifyName = Name;
            articleClassify.DefaultImgId = DefaultImgId;
            return articleClassify;
        }
    }
```
---
```
    public class ArticleContent :BaseEntity
    {
        public Article article { get; set; }

        public Guid ArticleId { get; set; }

        public string Content { get; set; }

        public static ArticleContent Create(Article article,string Content)
        {
            ArticleContent articleContent = new ArticleContent();
            articleContent.Content = Content;
            articleContent.article = article;
            return articleContent;
        }
    }
```
# 基础设施层
## 编写EntityConfigs
> 采用FluentAPI的形式构建表关系，ArticleService里的关系配置都写到了ArticleConfig里了
```
    public class ArticleConfig : IEntityTypeConfiguration<Article>
    {
        public void Configure(EntityTypeBuilder<Article> builder)
        {
            builder.ToTable("T_Articles");
            builder.HasKey(e => e.Id).IsClustered(false);//对于Guid主键，不要建聚集索引，否则插入性能很差
            builder.HasMany(s => s.Tags).WithMany(t => t.Articles).UsingEntity(j => j.ToTable("T_Articles_Tags"));

            builder.HasOne(s => s.Classify).WithMany(t => t.Articles);
            builder.HasOne(x => x.articleContent).WithOne(t => t.article).HasForeignKey<ArticleContent>(x => x.ArticleId);
            builder.HasOne(x => x.articleHtml).WithOne(t => t.article).HasForeignKey<ArticleHtml>(x => x.ArticleId);
        }
    }
```
## 编写DbContext
> 继承了BaseDbContext，继承DbContext，封装了对mediator的使用，暂无用到
```
    public class ArticleDbContext : BaseDbContext
    {
        public ArticleDbContext(DbContextOptions options, IMediator? mediator) : base(options, mediator)
        {
        }

        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleTag> Tags { get; set; }
        public DbSet<ArticleClassify> ArticleClassifies { get; set; }
        public DbSet<ArticleContent> ArticleContents { get; set; }
        public DbSet<ArticleHtml> ArticleHtmls { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);
        }
    }
```
## 执行迁移
1. 打开 **程序包管理控制台**,选择默认项目为DbContext所在的项目
2. 执行Add-migration *迁移内容信息*
3. 执行Update-Database 
4. 完成
# 应用层
## 注入DbContext并配置数据库链接
```
builder.Services.AddDbContext<ArticleDbContext>(option => 
                                                option.UseSqlServer(Environment.GetEnvironmentVariable("DefaultDB:ConnStr") ??
                                                builder.Configuration.GetValue<string>("ConnectionStrings:SqlServer")));
```
## 使用EF
### 增

``` 
        public async Task<ActionResult<Guid>> Add([FromForm] ArticleAddRequest request)
        {
            List<Guid> TagsGuid = new List<Guid>();
            if (request.Tags != null)
                TagsGuid = request.Tags.ToList();
            Article AddArticle = Article.Create(request.Title, request.content,request.html);

            //从数据库获取Classify并保存关系
            var Classify = await dbCtx.ArticleClassifies.FindAsync(request.Classify);
            if (Classify == null) throw new Exception("更新文章失败，未获取对应的分类");
            AddArticle.Classify = Classify;
            Classify.Articles.Add(AddArticle);
            //从数据库获取对应的Tags并保存关系
            var ArticleTags = dbCtx.Tags.Where(x => TagsGuid.Contains(x.Id)).ToList();
            AddArticle.Tags = ArticleTags;
            ArticleTags.ForEach(x => x.Articles.Add(AddArticle));

            dbCtx.Articles.Add(AddArticle);
            dbCtx.Tags.UpdateRange(ArticleTags);
            if (request.file != null)
            {
                EventBusHelper.EventBusFunc_UploadImg(EnumCallBackEntity.ArticleTitleImage, UploadImageType.ArticleTitleImage, request.file, AddArticle.Id, eventBus);
            }
            await dbCtx.SaveChangesAsync();


            return AddArticle.Id;
        }
```
### 删
``` 
        public async Task<bool> Delete(Guid id)
        {
            Article? DeleteArticle = await dbCtx.Articles.FindAsync(id);
            if (DeleteArticle == null)
                return false;
            dbCtx.Remove(DeleteArticle);
            await dbCtx.SaveChangesAsync();
            return true;
        }
```
### 改
```
        public async Task<Article> Modify([FromForm] ArticleModifyRequest request)
        {

            List<Guid> TagsGuid = request.tags.ToList();
            Article? ModifyArticle = await repository.GetArticleByIdAsync(request.id, true, true);
            if (ModifyArticle == null) throw new Exception("更新文章失败，通过Id未找到对应的文章");
            ModifyArticle.Title = request.title;

            var content = await dbCtx.ArticleContents.FindAsync(ModifyArticle.articleContent.Id);
            if (content == null) throw new Exception("更新文章失败，未获取对应的内容信息");
            content.Content = request.Content;
            ModifyArticle.SetContent(request.Content);

            var ArticleHtml = await dbCtx.ArticleHtmls.FindAsync(ModifyArticle.articleHtml.Id);
            if (ArticleHtml == null) throw new Exception("更新文章失败，未获取对应的Html信息");
            ArticleHtml.Html = request.Html;

            //从数据库获取Classify并保存关系
            var Classify = await dbCtx.ArticleClassifies.FindAsync(request.classify);
            if (Classify == null) throw new Exception("更新文章失败，未获取对应的分类");
            ModifyArticle.Classify = Classify;
            //从数据库获取对应的Tags并保存关系
            var ArticleTags = dbCtx.Tags.Include(x => x.Articles).Where(x => TagsGuid.Contains(x.Id)).ToList();
            ModifyArticle.Tags = ArticleTags;
            if (request.file != null)
            {
                EventBusHelper.EventBusFunc_UploadImg(EnumCallBackEntity.ArticleTitleImage, UploadImageType.ArticleTitleImage, request.file, ModifyArticle.Id, eventBus);
            }
            var ret = await dbCtx.SaveChangesAsync();

            return ModifyArticle;
        }
```
### 查
```
        public async Task<Article?> GetArticleByIdAsync(Guid ArticleId, bool NeedContent, bool NeedHtml)
        {
            return await GetArticleQueryAble(NeedContent, NeedHtml).FirstOrDefaultAsync(x => x.Id == ArticleId);
        }

        public async Task<Article[]?> GetArticlesByIdAsync(Guid[] Ids, bool NeedContent, bool NeedHtml)
        {

            return await GetArticleQueryAble(NeedContent, NeedHtml).Where(x => Ids.Contains(x.Id)).ToArrayAsync();
        }

        public IQueryable<Article> GetArticleQueryAble(bool NeedContent, bool NeedHtml)
        {
            var linq = dbCtx.Articles.Include(x => x.Classify).Include(x => x.Tags).AsQueryable();
            if (NeedContent) linq = linq.Include(x => x.articleContent);
            if (NeedHtml) linq = linq.Include(x => x.articleHtml);
            return linq;
        }
```