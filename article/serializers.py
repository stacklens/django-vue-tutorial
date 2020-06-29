from rest_framework import serializers


class ArticleListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(allow_blank=True, max_length=100)
    body = serializers.CharField(allow_blank=True)
    created = serializers.DateTimeField()
    updated = serializers.DateTimeField()
