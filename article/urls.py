from django.urls import path
from article import views

app_name = 'article'

urlpatterns = [
    path('', views.article_list, name='list'),
    path('<int:pk>/', views.ArticleDetail.as_view(), name='detail'),
]