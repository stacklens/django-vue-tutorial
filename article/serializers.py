from rest_framework import serializers
from article.models import Article

from user_info.serializers import UserDescSerializer


class ArticleDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'


class ArticleListSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name="article:detail")

    author = UserDescSerializer(read_only=True)

    class Meta:
        model = Article
        fields = [
            'url',
            # 'id',
            'title',
            'created',
            'author',
        ]
        # read_only_fields = ['author']

# class ArticleListSerializer(serializers.Serializer):
#     id = serializers.IntegerField(read_only=True)
#     title = serializers.CharField(allow_blank=True, max_length=100)
#     body = serializers.CharField(allow_blank=True)
#     created = serializers.DateTimeField()
#     updated = serializers.DateTimeField()
