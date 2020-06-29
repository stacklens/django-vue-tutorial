from rest_framework.decorators import api_view
from rest_framework.response import Response

from article.models import Article
from article.serializers import ArticleListSerializer


@api_view(['GET'])
def article_list(request):
    articles = Article.objects.all()
    serializer = ArticleListSerializer(articles, many=True)
    return Response(serializer.data)
