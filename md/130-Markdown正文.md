博客文章需要排版，否则难以凸显标题、正文、注释等内容之间的区别。作为博客写手来说，比较流行且好用的排版是采用 Markdown 语法。

严格来说， Markdown 是一种排版标注规则。它将两个星号包裹的文字标注为重要文本（通常也就是粗体字），比如原始文本中的 `**Money**` ，在 Markdown 语法中应该被”渲染“为粗体，也就是 **Money** 。类似的还有斜体、代码块、表格、公式等注释，就请读者自行了解了。

> [关于 Markdown](https://www.dusaiphoto.com/article/20/) 的简单介绍。

”渲染“ Markdown 也就是把原始文本中的注释转化为前端中真正被用户看到的 HTML 排版文字。渲染过程可以在前端也可以在后端，本文将使用后端渲染，以便你理解 DRF 的相关知识。

## 模型和视图

为了将博文的 Markdown 正文渲染为 html 标签，首先给文章模型添加一个 `get_md()` 方法：

```python
# article/models.py

from markdown import Markdown
...

class Article(models.Model):
    ...
    
    # 新增方法，将 body 转换为带 html 标签的正文
    def get_md(self):
        md = Markdown(
            extensions=[
                'markdown.extensions.extra',
                'markdown.extensions.codehilite',
                'markdown.extensions.toc',
            ]
        )
        md_body = md.convert(self.body)
        # toc 是渲染后的目录
        return md_body, md.toc
```

方法返回了包含了两个元素的元组，分别为已渲染为 html 的**正文**和**目录**。

这些渲染后的数据，在文章**详情接口**是需要的，但是在**列表接口**却没太有必要，因此又要用到视图集根据请求方式动态获取序列化器的技术了：

```python
# article/views.py

from article.serializers import ArticleDetailSerializer

...

# 新增 get_serializer_class() 方法
class ArticleViewSet(viewsets.ModelViewSet):
    ...

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleSerializer
        else:
            return ArticleDetailSerializer
```

序列化器 `ArticleDetailSerializer`  还没有写，这就来搞定它。

## 序列化器

因为**文章列表接口**和**详情接口**只有一点点返回字段的区别，其实大部分功能还是一样的。那么被面向对象编程熏陶的你，“把他抽象成父类！” 应该可以脱口而出：

```python
# article/serializers.py

...

# 将已有的 ArticleSerializer 里的东西全部挪到这个 ArticleBaseSerializer 里来
# 除了 Meta 类保留
class ArticleBaseSerializer(serializers.HyperlinkedModelSerializer):
    author = ...
    category = ...
    category_id = ...
    tags = ...

    def to_internal_value(self, data):
        ...

    def validate_category_id(self, value):
        ...

# 保留 Meta 类
# 将父类改为 ArticleBaseSerializer
class ArticleSerializer(ArticleBaseSerializer):
    class Meta:
        model = Article
        fields = '__all__'
        extra_kwargs = {'body': {'write_only': True}}
```

与 Django 表单类似，你可以继承扩展和重用序列化器。就像上面的代码一样，在父类上声明一组通用的字段或方法，然后在许多序列化程序中使用它们。

但是内部类 `class Meta` 比较特殊，它不会隐式从父类继承。虽然有办法让它隐式继承，但这是不被推荐的，你应该显式声明它，以使得序列化器的行为更清晰。

另外，如果你觉得在列表接口连 `body` 字段也不需要显示的话，你可以传入 `extra_kwargs` 使其变成仅可写却不显示的字段。

把这些**代码重构**的准备工作都搞定之后，就可以正式写这个新的 `ArticleDetailSerializer` 了：

```python
# article/serializers.py

...

# 注意继承的父类是 ArticleBaseSerializer
class ArticleDetailSerializer(ArticleBaseSerializer):
    # 渲染后的正文
    body_html = serializers.SerializerMethodField()
    # 渲染后的目录
    toc_html = serializers.SerializerMethodField()

    def get_body_html(self, obj):
        return obj.get_md()[0]

    def get_toc_html(self, obj):
        return obj.get_md()[1]

    class Meta:
        model = Article
        fields = '__all__'
```

`body_html` 、 `toc_html` 这两个渲染后的字段是经过加工后的数据，不存在于原始的数据中。为了将这类只读的附加字段添加到接口里，就可以用到 `SerializerMethodField()` 字段了。比如说上面代码中的 `body_html` 字段，它会自动去调用 `get_body_html()` 方法，并将其返回结果作为需要序列化的数据。方法中的 `obj` 参数是序列化器获取到的 model 实例，也就是文章对象了。

这样就大功告成了，读者自己测试一下，顺利的话详情接口就可以返回 Markdown 渲染后的数据了。

> 记得原始文本应该用 Markdown 语法编写。成功的话 `body_html` 字段返回的是带有 html 标签的文本。
>
> 代码重构得太早可能会导致某些不必要的抽象，太晚又可能堆积太多”屎山“而无从下手。理想情况下的重构是随着项目的开发同时进行的，在合适的节点进行合适的抽象，看着代码逐渐规整，你也会相当有成就感。

另一个问题是，有时候你可能出于版权方面的考虑不愿意将原始的 Markdown 文章数据给任意用户，那么这里只要做一次鉴权，根据用户的权限选用不同的序列化器即可。（非管理员不返回原始文章数据）