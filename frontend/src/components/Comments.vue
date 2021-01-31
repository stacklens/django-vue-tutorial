<template>
    <br>
    <br>
    <hr>
    <h3>发表评论</h3>
    <!-- 评论多行文本输入控件 -->
    <textarea
            v-model="message"
            :placeholder="placeholder"
            name="comment"
            id="comment-area"
            cols="60"
            rows="10"
    ></textarea>
    <div>
        <button @click="submit" class="submitBtn">发布</button>
    </div>

    <br>
    <p>已有 {{ comments.length }} 条评论</p>
    <hr>

    <!-- 渲染所有评论内容 -->
    <div
            v-for="comment in comments"
            :key="comment.id"
    >
        <div class="comments">
            <div>
                    <span class="username">
                        {{ comment.author.username }}
                    </span>
                于
                <span class="created">
                    {{ formatted_time(comment.created) }}
                </span>
                <span v-if="comment.parent">
                    对
                    <span class="parent">
                        {{ comment.parent.author.username }}
                    </span>
                </span>
                说道：
            </div>
            <div class="content">
                {{ comment.content }}
            </div>
            <div>
                <button class="commentBtn" @click="replyTo(comment)">回复</button>
            </div>
        </div>
        <hr>
    </div>
</template>

<script>
    import axios from 'axios';
    import authorization from '@/utils/authorization';

    export default {
        name: 'Comments',
        // 通过 props 获取当前文章
        props: { article: Object },
        data: function () {
            return {
                // 所有评论
                comments: [],
                // 评论控件绑定的文本和占位符
                message: '',
                placeholder: '说点啥吧...',
                // 评论的评论
                parentID: null
            }
        },
        // 监听 article 对象
        // 以便实时更新评论
        watch: {
            article() {
                this.comments = this.article !== null ? this.article.comments : []
            }
        },
        methods: {
            // 提交评论
            submit() {
                const that = this;
                authorization()
                    .then(function (response) {
                        if (response[0]) {
                            axios
                                .post('/api/comment/',
                                    {
                                        content: that.message,
                                        article_id: that.article.id,
                                        parent_id: that.parentID,
                                    },
                                    {
                                        headers: {Authorization: 'Bearer ' + localStorage.getItem('access.myblog')}
                                    })
                                .then(function (response) {
                                    // 将新评论添加到顶部
                                    that.comments.unshift(response.data);
                                    that.message = '';
                                    alert('留言成功')
                                })
                        }
                        else {
                            alert('请登录后评论。')
                        }
                    })
            },
            // 对某条评论进行评论
            // 即二级评论
            replyTo(comment) {
                this.parentID = comment.id;
                this.placeholder = '对' + comment.author.username + '说:'
            },
            // 修改日期显示格式
            formatted_time: function (iso_date_string) {
                const date = new Date(iso_date_string);
                return date.toLocaleDateString() + '  ' + date.toLocaleTimeString()
            },
        }
    }
</script>

<style scoped>
    button {
        cursor: pointer;
        border: none;
        outline: none;
        color: whitesmoke;
        border-radius: 5px;
    }

    .submitBtn {
        height: 35px;
        background: steelblue;
        width: 60px;
    }

    .commentBtn {
        height: 25px;
        background: lightslategray;
        width: 40px;
    }

    .comments {
        padding-top: 10px;
    }

    .username {
        font-weight: bold;
        color: darkorange;
    }

    .created {
        font-weight: bold;
        color: darkblue;
    }

    .parent {
        font-weight: bold;
        color: orangered;
    }

    .content {
        font-size: large;
        padding: 15px;
    }
</style>