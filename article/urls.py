from django.urls import path
from article import views

app_name = 'article'

urlpatterns = [
    path('', views.article_list, name='list'),
]