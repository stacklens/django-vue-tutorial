from rest_framework import serializers

from comment.models import Comment
from user_info.serializers import UserDescSerializer


class CommentSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='comment-detail')
    author = UserDescSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        extra_kwargs = {'created': {'read_only': True}}