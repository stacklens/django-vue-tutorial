[![](https://img.shields.io/badge/python-3.8-orange.svg)](https://www.python.org/downloads/release/python-370/)
[![](https://img.shields.io/badge/django-3.1-green.svg)](https://docs.djangoproject.com/en/2.1/releases/2.1/)
[![](https://img.shields.io/badge/vue-3.0-blue.svg)](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
[![](https://img.shields.io/badge/license-CC_BY_NC_4.0-000000.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

# Django-Vue 搭建博客教程

本教程是一个面向新手的**前后端分离**模式开发个人博客的教程，目的是快速搭建现代化的个人博客网站。

教程基于 Django 3 和 Vue 3 。

> 于 Win 10 系统开发。用 Mac 或 Linux 也 OK。

## 教程特点
- **入门级、全中文、永久免费**
- **代码、教程全开源**
- **基于 Django 3 和 Vue 3**

## 适合人群
**学习本教程需要：**

- 具备 Django 传统开发基础知识
- 具备 Javascript 语法基础知识
- 每天能抽出一个小时学习

总之，本教程的面向人群：**掌握 Django 基础和 Javascript 语法基础的入门开发者。**

如果你是老读者，那么应该已经看过我的 Django 传统开发入门教程了：

- [博客传送门](https://www.dusaiphoto.com/article/2/)
- [GitHub传送门](https://github.com/stacklens/django_blog_tutorial/tree/master/md)
- [知乎传送门](https://www.zhihu.com/column/django-blog)

> 微信公众号也同步更新，搜“杜赛说编程”即可。

恭喜你，**后端章节**的 `Python` 和 `Django` 部分的基础知识就足够了。没看过的读者可以先浏览一遍（重点看 Model 和 View 部分，Template 可以适当跳过）。

> 本教程的重点在于介绍前后端分离开发，因此不会深究 Django 的基础知识。

**前端章节**你需要预先学习 `Javascript` 语法基础，推荐读物如下：

- [廖雪峰的Javascript教程](https://www.liaoxuefeng.com/wiki/1022910821149312)
- [FreeCodeCamp](https://www.freecodecamp.org/learn/)
- [ES6 入门教程](https://es6.ruanyifeng.com/)

除此之外，如果你能浏览一遍 [Vue 3](https://v3.cn.vuejs.org/guide/introduction.html)的官方指南就更好了。

准备好以上知识储备后，你就可以继续阅读本教程了。

> 有的读者喜欢边学边查，这样也可以，请根据自身习惯调整。

## 加入社区

一个人的学习是孤单的。欢迎扫码 Django 交流QQ群（107143175）、微信公众号、TG群组，和大家一起进步吧。

![](https://blog.dusaiphoto.com/QR-0608.jpg)

## 教程导航
**01** - [前言](https://github.com/stacklens/django-vue-tutorial/blob/master/md/10-前言.md)

- 教程简介 / 资源列表 / 许可协议

**02** - [搭建开发环境](https://github.com/stacklens/django-vue-tutorial/blob/master/md/20-搭建开发环境.md)

- 环境简介 / 安装 Python / 配置虚拟环境
- 安装 Django / 创建 Django 项目 / 运行 Django 服务器
- 代码编辑器 / 浏览器选择

**03** - [drf初识](https://github.com/stacklens/django-vue-tutorial/blob/master/md/30-drf初识.md)

- 创建 Model 结构 / 初始序列化

**04** - [序列化器与视图函数](https://github.com/stacklens/django-vue-tutorial/blob/master/md/40-序列化器与视图函数.md)

- ModelSerializer
- APIView
- 内容协商

**05** - [基于类的视图](https://github.com/stacklens/django-vue-tutorial/blob/master/md/50-基于类的视图.md)

- 类视图 / 通用视图
- 资源更新

**06** - [限制用户权限](https://github.com/stacklens/django-vue-tutorial/blob/master/md/60-限制用户权限.md)

- 权限控制

**07** - [文章关联用户](https://github.com/stacklens/django-vue-tutorial/blob/master/md/70-文章关联用户.md)

- 外键序列化
- 序列化嵌套 / 字段遮蔽

**08** - [超链接与分页](https://github.com/stacklens/django-vue-tutorial/blob/master/md/80-超链接与分页.md)

- 超链接字段
- 分页

**09** - [视图集](https://github.com/stacklens/django-vue-tutorial/blob/master/md/90-视图集.md)

- 视图集简介
- Router

**10** - [过滤文章](https://github.com/stacklens/django-vue-tutorial/blob/master/md/100-过滤文章.md)

- 参数过滤 / 通用过滤

**11** - [文章分类](https://github.com/stacklens/django-vue-tutorial/blob/master/md/110-文章分类.md)

- 覆写方法
- 自定义验证器
- 主键字段 / 序列化器选择

**12** - [文章标签](https://github.com/stacklens/django-vue-tutorial/blob/master/md/120-文章标签.md)

- 多对多模型
- 验证器 / to_internal_value
- 覆写 create 方法 / slugField

**13** - [Markdown正文](https://github.com/stacklens/django-vue-tutorial/blob/master/md/130-Markdown正文.md)

- Model 自定义方法
- 序列化器继承

**14** - [文章标题图](https://github.com/stacklens/django-vue-tutorial/blob/master/md/140-文章标题图.md)

- 图片Model
- 文件上传

**15** - [评论](https://github.com/stacklens/django-vue-tutorial/blob/master/md/150-评论.md)

- 自定义权限

**16** - [评论的评论](https://github.com/stacklens/django-vue-tutorial/blob/master/md/160-评论的评论.md)

- Model自关联 / exclude

**17** - [JWT身份验证](https://github.com/stacklens/django-vue-tutorial/blob/master/md/170-JWT身份验证.md)

- JWT 与 token

**18** - [用户管理](https://github.com/stacklens/django-vue-tutorial/blob/master/md/180-用户管理.md)

- 自定义权限
- 自定义 action

**19** - [前端开发准备](https://github.com/stacklens/django-vue-tutorial/blob/master/md/190-前端开发准备.md)

- 中期准备
- Vue 简介 / 搭建前端服务

**20** - [文章列表](https://github.com/stacklens/django-vue-tutorial/blob/master/md/200-文章列表.md)

- Axios / 跨域
- Vue 结构 / 状态数据
- 组件化

**21** - [文章详情](https://github.com/stacklens/django-vue-tutorial/blob/master/md/210-文章详情.md)

- vue-router / 动态路由
- 路由参数

**22** - [翻页与监听](https://github.com/stacklens/django-vue-tutorial/blob/master/md/220-翻页与监听.md)

- 翻页与路由
- watch监听

**23** - [搜索文章](https://github.com/stacklens/django-vue-tutorial/blob/master/md/230-搜索文章.md)

- 编程式路由
- 事件绑定 / 原型链

**24** - [用户注册](https://github.com/stacklens/django-vue-tutorial/blob/master/md/240-用户注册.md)

- 数据提交 / this 与 that

**25** - [用户登录](https://github.com/stacklens/django-vue-tutorial/blob/master/md/250-用户登录.md)

- Token 的获取、存储与刷新

**26** - [资料更新与异步](https://github.com/stacklens/django-vue-tutorial/blob/master/md/260-资料更新与异步.md)

- 异步函数 / 代码重构
- 身份验证
- 下拉框界面

**27** - [资料删除与组件通信](https://github.com/stacklens/django-vue-tutorial/blob/master/md/270-资料删除与组件通信.md)

- Props 与 Events
- 组件通信 / 访问子组件

**28** - [发表文章](https://github.com/stacklens/django-vue-tutorial/blob/master/md/280-发表文章.md)

- 样式绑定 / 数据预处理

**29** - [文章更新与删除](https://github.com/stacklens/django-vue-tutorial/blob/master/md/290-文章更新与删除.md)

- 操作数据

**30** - [标题图的提交](https://github.com/stacklens/django-vue-tutorial/blob/master/md/300-标题图的提交.md)

- 提交图片 / 表单监听
- 样式绑定 /  src 绑定

**31** - [发布评论](https://github.com/stacklens/django-vue-tutorial/blob/master/md/310-发布评论.md)

- Props / 日期格式化

**32** - [组合式API](https://github.com/stacklens/django-vue-tutorial/blob/master/md/320-组合式API.md)

- 组合式API简介
- setup 方法 / methods / computed / mounted / watch

**33** - [部署](https://github.com/stacklens/django-vue-tutorial/blob/master/md/330-部署.md)

- 云服务器 / 远程连接
- 下载项目 / 部署
- 运行与维护

**34** - [结语](https://github.com/stacklens/django-vue-tutorial/blob/master/md/340-结语.md)

- 结束与开始

## 教程快照
**博客首页片段：**
![](https://blog.dusaiphoto.com/drf-p300-2.png)

---

**博客详情页片段：**
![](https://blog.dusaiphoto.com/p210-1.jpg)

## 运行示例代码
首先确保你的电脑已经安装 Python 3.8 、npm 6.14 或以上的版本。

下载项目后，修改配置文件 `drf_vue_blog/settings.py` ：

```python
# drf_vue_blog/settings.py

...
# 修改为 True
DEBUG = True
...
```

在 **PowerShell 命令行**中进入项目目录，并创建**虚拟环境**：

```bash
python -m venv venv
```

> 若上述方法不成功，则可以通过 `virtualenv` 库创建虚拟环境，效果相同。具体方法请搜索。

运行**虚拟环境**（Windows环境）:

```bash
venv\Scripts\activate.bat
```

或（Linux环境）：

```bash
source venv/bin/activate
```

自动安装所有依赖项：

```bash
pip install -r requirements.txt
```

然后进行数据迁移：

```bash
python manage.py migrate
```

运行后端服务器：
```bash
python manage.py runserver
```

新创建一个 PowerShell 命令行窗口，进入项目的 `frontend/` 目录，安装前端依赖项：

```bash
npm install
```

运行前端服务器：

```bash
npm run serve
```

至此前后端开发服务器就都启动了。

浏览器中输入地址 `http://localhost:8080/` 访问博客界面，输入 `http://127.0.0.1:8000/api/` 访问接口数据。

数据库文件 `db.sqlite3` 以及媒体文件夹 `media` 中的内容是方便读者查看示例效果而存在的。

管理员账号：dusai  密码：admin123456

如果你想清除所有数据及媒体文件，将它们直接删除，并运行：

```bash
python manage.py createsuperuser
```

即可重新创建管理员账号。

## 致谢

由于笔者水平有限，为避免误人子弟，特别邀请了两位资深大佬对本教程进行审稿，并提出很多宝贵的意见。

在此表示感谢：

- [Frost Ming](https://github.com/frostming)
- [细露仔](https://github.com/xiluzi)

## 许可协议

本教程（包括且不限于文章、代码、图片等内容）遵守 **署名-非商业性使用 4.0 国际 (CC BY-NC 4.0) 协议**。协议内容如下。

**您可以自由地：**

- **共享** — 在任何媒介以任何形式复制、发行本作品。
- **演绎** — 修改、转换或以本作品为基础进行创作。

只要你遵守许可协议条款，许可人就无法收回你的这些权利。

**惟须遵守下列条件：**

- **署名** — 您必须给出**适当的署名**，提供指向本许可协议的链接，同时标明是否（对原始作品）作了修改。您可以用任何合理的方式来署名，但是不得以任何方式暗示许可人为您或您的使用背书。
- **非商业性使用** — 您不得将本作品用于**商业目的**。

- **没有附加限制** — 您不得适用法律术语或者技术措施从而限制其他人做许可协议允许的事情。

> 适当的署名：您必须提供创作者和署名者的姓名或名称、版权标识、许可协议标识、免责标识和作品链接。
>
> 商业目的：主要目的为获得商业优势或金钱回报。