> Entity Framework (EF) Core 是轻量化、可扩展、开源和跨平台版的常用 Entity Framework 数据访问技术。

# EF Core 的底层原理
ef core 是基于ado.net core 的
ef core将语句转化为sql语句，再由ado.net与数据库进行沟通

# EF Core 三种开发模式
1. Code First(个人偏爱在推荐，中小项目敏捷开发首选)
2. Database First（使用大型项目）
3. Model First

# 表特性配置的两种方式
1.Data Annotation，特性描写，在类的属性上面添加特性实现效果，耦合性强，但是方便
2.fluentAPI,在单独的配置类中进行配置，麻烦点，但是降低耦合度，更有益未来。

# 如何使用EF Core的Code First
> 下面讲解了本博客Code First的使用流程，表的配置方式采用FluentAPI，数据库配置写在注入里。
1. 建立实体类，设置字段在迁移后就会成为表字段。
2. 编写继承IEntityTypeConfiguration的配置类，实现接口Configure可操作表的各种细节，如表名，表与表关系等。
3. 建立继承DBContext的类，设置DbSet<T>来指明用到的表，重写OnModelCreating方法来配置上面的Configure是在哪个程序集下面
4. program类填写AddDbContext<T>注入对应的类，并在lambda里指向数据库配置
5. Nuget安装EF Core版本的Microsoft.EntityFrameworkCore.Tools包到DBContext所在项目。
6. ctrl+`打开程序包管理控制台，默认项目选中tools所在项目，执行命令Add-migration [name]
7. 上面成功后执行Update-DataBase。
8. Over，表已生成
----
实体类：
```
/**生成表Article，带有字段Id等**/
public class Article{
  public Guid Id {get; set;}
  ...
}
```
配置类：
```
/**自由配置表信息**/
internal class ArticleConfig : IEntityTypeConfiguration<BlogParameter>
    {
        public void Configure(EntityTypeBuilder<ArticleConfig > builder)
        {
            /**修改了表名**/
            builder.ToTable("T_ArticleParameter");
            
        }
    }
```
DbContext类:
```
public abstract class BaseDbContext : DbContext{
        public BaseDbContext(DbContextOptions options) : base(options){}
        
        /**配置使用的数据库**/
        public DbSet<Article> Articles { get; set; }
    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            /**配置在当前程序集寻找配置类**/
            modelBuilder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);
        }
}
```
program类:
```
    builder.Services.AddDbContext<ArticleDbContext>(option => option.UseSqlServer("链接字符串"))
```

# 表与表的关系
> 表与表的关系分为如下三种【一对多】【多对多】【一对一】，EF Core都能完美实现。下面讲解统一用A对B，这波可以理解B表为主表（Article），A表为其他表（如标签，分类，内容）
## 一对多

A表需要拥有属性List\<B> ,B表拥有属性A，然后在fluentAPI里配置关系
```
A表拥有
 public List<B> BNames { get; set; } = new List<B>();
B表拥有
 public A AName { get; set; } = new A();

B表的fluentAPI配置
builder.HasOne(s => s.AName ).WithMany(t => t.BNames);

```
## 多对多
A表和B表都要有List\<T>。执行生成后会在数据库多生成一个A_B表，有着A和B表的主键关系。
```
A表
public List<B> BNames { get; set; } = new List<B>();
B表
public List<A> ANames { get; set; } = new List<A>();

B表的FluentAPI配置,自行定义了生成的关系表名
builder.HasMany(s => s.ANames ).WithMany(t => t.BNames).UsingEntity(j => j.ToTable("T_A_B"));

```
## 一对一
A表和B表都要有对方的类字段，选择其中一个表（建议非主表）加上代表另一个表ID的字段。

```
A表
public B BName { get; set; } = new B();
public Guid BId;//接收B表的Id
B表
public Guid BId;//B表主键
public A AName { get; set; } = new A();

B表的FluentAPI
builder.HasOne(x => x.AName).WithOne(t => t.BName).HasForeignKey<A>(x => x.BId);

```

# EF Core 操作

## 1. 查询
> 用linq和lambda操作DbContex获取数据。
若操作只用于查询而不进行修改，可以追加AsNoTracking()减少内存压力，
查询数据的时候如果有表和表的关系字段在，需要添加Include()才能获取。
可以通过Skip和Take实现分页查询
若想直接编写Sql查询，可使用FromSql()
想执行任意效果的Sql语句，使用ADO.Net 操作或Dapper
```
查询方法就是正常使用linq
dbcontext.A.where(x=>x.id='123').tolist();
添加AsNoTracking()，提高性能
dbcontext.A.where(x=>x.id='123').AsNoTracking().tolist();
查询A表，并且获取B表内容
dbcontext.A.include(x=>x.BName).tolist();
分页查询第二页的5条数据
dbcontext.A.where(x=>x>1).skip(2).take(5).tolist();
直接使用Sql
context.Blogs.FromSql($"SELECT * FROM dbo.Blogs").ToList();
任意查询语句，ADO.Net
DbConnection conn=ctx.Database.GetDbConnecetion();
if(conn.state!=System.Data.ConnectionState.Open){
  await conn.openAsync()
}
using (var cmd =conn.CreateCommand()){
    cmd.CommandText="任意sql"
    using（var reader =await cmd.ExecuteReaderAsync()）{
  while(await reader.ReadAsync()){
    //和查询出的内容对应的类型
    string price=reader.Get()
   }

  }
}
```
## 2.新增
> 通过新增实体类，然后Add到DbContext对应的DbSet，执行SaveChange（）即可
若表关联其他表，则对内部的字段执行Add操作，在savechange的时候会一并更新

```
基础操作，默认都在最后执行SaveChange();
A a=new A()
dbContext.A.Add(A)
关联其他表
B b =new B()
A.B=b
dbContext.A.add(A)

```

## 3.修改
> EF Core 的修改只要对实体做了修改，那么在savechange的时候也会跟着修改。
但是在修改关联表的时候，需要查出关联表数据再修改，通过include修改其数据无法被追踪到
```
基本修改,将A表标题改为123,后面默认执行SaveChange()
A a =dbContext.A.first()
a.title='123'
```
## 4.删除
> EF Core 的删除很方便，直接调用Remove即可，删除记录会把其他关联的表的该记录移除
```
A a = dbContext.A.first()
dbContext.remove(a);
savechange();
```

# IEnumerable 和 IQueryable
IEnumerable 是已经将数据从数据库取出来后
IQueryable 还未将数据从数据库取出来,是延时查询
因此我们要将where等筛选逻辑写到tolist等转IEnumerable之前，也因为Iqueryable在tolist之前只是表达式，我们可以在执行前对它随意操作，写一些公共方法，实现动态查询逻辑
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

# 执行原生的非查询语句
使用dbcontext.Database.ExcuteSqlInterpolated()和其Async方法。
记得使用内插值写法，EF Core会自动处理，防止Sql注入

# EF Core 对实体的监控
由DbContext查询出的实体默认都会被赋予监控，监控其状态，实体一共有如下几个状态
1. 已添加(Added)：DbContext正在跟踪此实体，但数据库中尚不存在该实体。
2. 未改变(Unchanged)：DbContext正在跟踪此实体，该实体存在于数据库中，其属性值和从数据库中读取到的值一致，未发生改变。
3. 已修改(Modified)：DbContext正在跟踪此实体，并存在于数据库中，并且其部分或全部属性值已修改。
4. 已删除(Deleted)：DbContext正在跟踪此实体，并存在于数据库中，但在下次调用 SaveChanges 时要从数据库中删除对应数据。
5. 已分离(Detached)：DbContext未跟踪该实体。
----
“已分离”和“未改变”的实体，SaveChanges()忽略；
“已添加”的实体，SaveChanges() 插入数据库；
“已修改”的实体，SaveChanges() 更新到数据库；
“已删除”的实体，SaveChanges() 从数据库删除；

可以通过DbContext的Entry()方法来获得实体在EF Core中的跟踪信息对象EntityEntry

# 全局查询筛选器
可以在fluentAPi方法内 添加 HasQueryFilter 实现全局筛选过滤，比较经典的例子为软删除判断IsDeleted
Builder.HasQueryFilter(x=>x.isDeleted!=1);