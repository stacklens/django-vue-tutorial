Web 程序是使用 HTTP 协议传输的，而 HTTP 协议是**无状态**的协议，对于事务没有记忆能力。也就是说，如果没有其他形式的帮助，服务器是没办法知道前后两次请求是否是同一个用户发起的，也不具有对用户进行身份验证的能力。

传统 web 开发中（以及前面的章节），身份验证**通常**是基于 Session 会话机制的。Session 对象存储特定用户会话所需的属性及配置信息。这样，当用户在应用程序的 Web 页之间跳转时，存储在 Session 对象中的变量将不会丢失，而是在整个用户会话中一直存在下去。 Session 通常是存储在服务器当中的，如果 Session 过多，会对服务器产生压力。

另一种比较常用的身份验证方式是 JWT (JSON Web Token) 令牌。JWT 是一种开放标准，它定义了一种紧凑且自包含的方式，用于在各方之间作为 JSON 对象安全地传输信息。由于 Token 是经过数字签名的，因此可以被验证和信任。JWT 非常适合用于身份验证和服务器到服务器授权。与 Session 不同，JWT 的 **Token** 是保存在用户端的，即摆脱了对服务器的依赖。

JWT 令牌长这样子的：

```python
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA5MjEwMjg0LCJqdGkiOiJiNzMxMTliMTZjNWM0YTExODNkOGJiZTNhZDZmZmYzMyIsInVzZXJfaWQiOjJ9.59ZavqFzjE3EoDrniu2cwgc_cq1Rv1OxpZeqRte_HLw
```

在进行某些需要验证身份的业务中，用户需要把令牌一并提交（就跟提交用户名及密码类似）。

> 这里有详细的 [JWT 工作方式讲解](https://jwt.io/introduction)。

本章尝试将身份验证方法更改为 JWT 形式。

## 代码修改

首先 pip 安装 `djangorestframework-simplejwt` 这个 jwt 库：

```python
(venv) > pip install djangorestframework-simplejwt
```

修改配置文件，使 JWT 为默认的验证机制：

```python
# drf_vue_blog/settings.py

...

REST_FRAMEWORK = {
    ...
    
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )

}
```

在根路由中添加 Token 的获取和刷新地址：

```python
# drf_vue_blog/urls.py

...

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    ...
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

这就完成了，毫无痛苦，这就是用一个优秀轮子的好处。

## 测试

上一章的评论模块已经做好了权限控制的内容，正好拿来测试。

首先，携带用户名和密码发送一个 POST 请求，以获取 Token：

```python
> http post http://127.0.0.1:8000/api/token/ username=Obama password=admin123456
        
HTTP/1.1 200 OK
...
{
    "access": "eyJ(...此处忽略一大串字母，后同...)iJ9.eyJ(...)jJ9.MdY(...)kEM",
    "refresh": "eyJ(...)iJ9.eyJ(...)yfQ.-Pu(...)pPQ"
}
```

拿到 Token 后，就可以用 Token 作为你的身份令牌，进行正常的资源请求了：

> Postman 有一个专门的标签页 (Authorization) 用于填写令牌。此标签页的 Type 栏选择 Bearer Token 即可。

```python
> http put http://127.0.0.1:8000/api/comment/21/ parent_id=20 article_id=2 content='comment to parent comment 10' "Authorization: Bearer eyJ(......)iJ9.eyJ(...)jJ9.MdY(...)kEM"

HTTP/1.1 200 OK
...
{
    "article": "http://127.0.0.1:8000/api/article/2/",
    "author": {
        ...
    },
    "content": "comment to parent comment 10",
    ...
}
```

令牌具有过期时间（默认为5分钟，可在配置中修改），过期之后就不能再使用了，但是可用刷新令牌再获取一个新的令牌：

```python
> http post http://127.0.0.1:8000/api/token/refresh/ refresh=eyJ(...)iJ9.eyJ(...)yfQ.-Pu(...)pPQ

HTTP/1.1 200 OK
...
{
    "access": "eyJ(...)iJ9.eyJ(...)jJ9.59Z(...)HLw"
}
```

功能与用 Session 相同，并且成功切换到 JWT 方式了。

> 开启 JWT 后，Session 验证就自动失效了。也就是说，除了申请 Token 时会用到账户密码，其他时候的身份验证都不再需要它们了。
>
> Session 和 JWT 哪个好？将会话移至客户端意味着摆脱了对服务器端会话的依赖，但这会带来如何安全存储、运输令牌等一系列挑战。不能够一概而论，而是要根据你的项目实际需求。关于这个话题更深入的讨论，请移步[Stackoverflow](https://stackoverflow.com/questions/43452896/authentication-jwt-usage-vs-session)。

## 有效期

Token 默认有效期很短，只有 5 分钟。你可以通过修改 Django 的配置文件进行更改：

```python
# drf_vue_blog/settings.py

...

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=10),
}
```

> Token 一旦泄露，任何人都可以获得该令牌的所有权限。出于安全考虑，Token 的有效期通常不应该设置得太长。

更多配置项请查看[官方文档](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html)。