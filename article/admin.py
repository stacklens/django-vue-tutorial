from django.contrib import admin
from article.models import Article, Category, Tag, Avatar

admin.site.register(Article)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Avatar)
