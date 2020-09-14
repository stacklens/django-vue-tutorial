from rest_framework import serializers

from comment.models import Comment
from user_info.serializers import UserDescSerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserDescSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
