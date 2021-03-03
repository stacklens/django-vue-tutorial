*学习 drf 需要以 Django 的基础知识作为支撑，因此下面关于 Django 基础部分就不会展开讲解了。如果你感觉下面的代码理解起来非常困难，磨刀不误砍柴工，那么建议先阅读我的 Django 基础教程：*

- [博客版](https://www.dusaiphoto.com/article/detail/2/)
- [GitHub版](https://github.com/stacklens/django_blog_tutorial)

## drf 开发预备

首先在命令行创建博客文章的 App：

```bash
(venv) > python manage.py startapp article
```

创建一个简单的博客文章模型：

```python
# article/models.py

from django.db import models
from django.utils import timezone

# 博客文章 model
class Article(models.Model):
    # 标题
    title = models.CharField(max_length=100)
    # 正文
    body = models.TextField()
    # 创建时间
    created = models.DateTimeField(default=timezone.now)
    # 更新时间
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
```

前后端分离中涉及到一个重要的概念：**序列化**（后面讲解）。Django 有一个非常优秀的库 djangorestframework（后称 **DRF**）。它可以帮我们封装好序列化的底层实现，让开发者专注于业务本身。

安装 DRF 及其他依赖库：

```bash
pip install djangorestframework==3.12.2
pip install markdown==3.3.3
pip install django-filter==2.4.0
```

然后将 App 注册列表：

```python
# drf_vue_blog/settings.py

INSTALLED_APPS = [
    ...

    'rest_framework',
    'article',
]
```

接着还需要添加 DRF 的登录视图，以便 DRF 自动为你的可视化接口页面生成一个用户登录的入口：

> 后续开发出接口页面后试着把这行代码删掉，看看会有什么不同。

```python
# drf_vue_blog/urls.py

...
from django.urls import include

urlpatterns = [
    ...
    path('api-auth/', include('rest_framework.urls')),
]

```

最后记得数据迁移：

```bash
(venv) > python manage.py makemigrations
(venv) > python manage.py migrate
```

准备工作就做好了。

## 序列化与Django

前后端分离的核心思想之一，就是两端交互不通过模板语言，而只传输需要的数据。因此问题就来了。

在 Django 程序的运行过程中，变量都是存储在服务器的内存中；更要命的是，后端 Django 程序中存储的是 Python 变量，而前端的浏览器中是 Javascript 变量，这两者是无法直接通过你家的网线进行传递和交流的。因此需要规定一个“标准格式”，前后端都根据这个标准格式，对资源进行保存、读取、传输等操作。

`JSON` 就是这种标准格式之一。它很轻量，表示出来就是个字符串，可以直接被几乎所有的语言读取，非常方便。

举个例子，把 Python 对象转换为 JSON ，这被称为**序列化**（serialization）：

```python
>>> import json
>>> person = dict(name='Trump', age=82)
>>> json.dumps(person)
# 这是个字符串
'{"age": 82, "name": "Trump"}'
```

把 JSON 转换为 Javascript 对象，被称为**反序列化**：

```python
>>> json_str = '{"age": 82, "name": "Trump"}'
>>> json.loads(json_str)
# 这是个 js 对象
{'age': 82, 'name': 'Trump'}
```

总之，把变量从内存中变成可存储或传输的过程称之为**序列化**，反过来把变量内容从序列化的对象重新读到内存里称之为**反序列化**。

回顾 Django 传统流程对一个网络请求的处理：

```python
def a_list(request):
    articles = Article.objects.all()
    return render(..., context={'articles': articles})
```

视图函数将数据作为上下文返回，通过模板引擎将上下文渲染为页面中的数据。

**Restful** 的处理流程仅增加了一步，即对数据**序列化**的处理：

```python
def a_list(request):
    articles = Article.objects.all()
    # 序列化数据
    serializer = Serializer(articles, many=True)
    return JsonResponse(serializer.data, safe=False)
```

数据被序列化为 Json 字符串，直接交由前端处理。

这就是前后端分离的雏形：

- 后端提供数据；
- 前端专注于操作数据、渲染页面。

> 这里又出现了与前后端分离联系很紧密的新概念：Rest（表现层状态转化） 和 Restful。Restful 架构是指客户端和服务器之间的交互、操作符合 Rest 规范，即：每一个URI代表一种资源；客户端和服务器之间，传递资源的表现层；客户端通过四个HTTP动词，对服务器端资源进行操作，实现"表现层状态转化"。有点难理解，推荐读物[阮一峰的博客](https://www.ruanyifeng.com/blog/2011/09/restful.html)和[知乎文章](https://www.zhihu.com/question/28557115)。

## Hello World

按照这个思路，我们来写一个文章列表接口吧。

`article` 模型在前面已经写好了，接下来写视图：

```python
# article/views.py

from django.http import JsonResponse
from article.models import Article
# 这个 ArticleListSerializer 暂时还没有
from article.serializers import ArticleListSerializer

def article_list(request):
    articles = Article.objects.all()
    serializer = ArticleListSerializer(articles, many=True)
    return JsonResponse(serializer.data, safe=False)
```

代码一共就 3 行：

- 取出所有文章的 `QuerySet`；
- 根据 `QuerySet` 数据，创建一个序列化器；
- 将序列化后的数据以 Json 的形式返回。

跟说好的一样，返回的东西不再是传统的模板了，而是 Json 数据。

代码里的序列化器 `ArticleListSerializer` 我们还没写，接下来就完成它。

新建一个 `article/serializers.py` 的文件，写入下面的代码：

```python
# article/serializers.py

from rest_framework import serializers

class ArticleListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(allow_blank=True, max_length=100)
    body = serializers.CharField(allow_blank=True)
    created = serializers.DateTimeField()
    updated = serializers.DateTimeField()
```

序列化类看起来与 Django 的 `Form` 表单类非常的类似。它指定了接口数据中各个字段的具体类型，自动对**请求**和**响应**中的数据进行序列化和反序列化的转换。其底层实现逻辑已经由 DRF 框架封装好了，在入门阶段通常不需要你操心。

最后将各级 `urls.py` 配置好：

```python
# drf_vue_blog/urls.py
...
urlpatterns = [
    ...
    path('api/article/', include('article.urls', namespace='article')),
]

```

以及：

```python
# article/urls.py

from django.urls import path
from article import views

app_name = 'article'

urlpatterns = [
    path('', views.article_list, name='list'),
]
```

代码部分就完成了。

接下来创建一个管理员用户，并在后台中随意给 `article` 添加几个测试数据，启动服务器并在浏览器中访问 `http://127.0.0.1:8000/api/article/`，可以看到页面中返回的 Json 字符串如下（稍作了排版）：

```python
[
    {
        "body": "Maybe say somthing here...",
        "created": "2020-06-15T09:24:18Z",
        "id": 1,
        "title": "My first post",
        "updated": "2020-06-15T09:24:38.622789Z"
    },
    {
        "body": "Second test..",
        "created": "2020-06-15T09:24:38Z",
        "id": 2,
        "title": "Another post",
        "updated": "2020-06-15T09:24:58.253400Z"
    },
    {
        "body": "Some content also..",
        "created": "2020-06-15T09:24:58Z",
        "id": 3,
        "title": "Third article with awesome things",
        "updated": "2020-06-15T09:25:25.602840Z"
    }
]
```

虽然简陋，但是你已经成功完成了一个简单的接口。

> 创建管理员用户、在后台中添加数据是非常基础的内容，如果不清楚请参照 [这篇文章](https://www.dusaiphoto.com/article/detail/15/)。
>
> 如果你进入后台发现页面没有样式，那是因为静态文件未配置路由引起的。解决这个问题请参考 [配置静态文件](https://www.dusaiphoto.com/article/92/)。