from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# 博客文章 model
class Article(models.Model):
    # 作者
    author = models.ForeignKey(User, on_delete=models.CASCADE)
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