<template>
    <div id="header">
        <div class="grid">
            <div></div>
            <h1>My Drf-Vue Blog</h1>
            <div class="search">
                <form>
                    <input v-model="searchText" type="text" placeholder="输入搜索内容...">
                    <button v-on:click.prevent="searchArticles"></button>
                </form>
            </div>
        </div>
        <hr>
        <div class="login">
            <div v-if="hasLogin">
                欢迎, {{username}}!
            </div>
            <div v-else>
                <router-link to="/login" class="login-link">登录</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'BlogHeader',
        data: function () {
            return {
                searchText: '',
                username: '',
                hasLogin: false,
            }
        },
        methods: {
            searchArticles() {
                const text = this.searchText.trim();
                if (text.charAt(0) !== '') {
                    this.$router.push({name: 'Home', query: {search: text}})
                }
            }
        },
        mounted() {
            const that = this;
            const storage = localStorage;

            const expiredTime = Number(storage.getItem('expiredTime.myblog'));
            const current = (new Date()).getTime();
            const refreshToken = storage.getItem('refresh.myblog');

            that.username = storage.getItem('username.myblog');

            // 初始 token 未过期
            if (expiredTime > current) {
                that.hasLogin = true;
            }
            // 初始 token 过期
            // 申请刷新 token
            else if (refreshToken !== null) {
                axios
                    .post('/api/token/refresh/', {
                        refresh: refreshToken,
                    })
                    .then(function (response) {

                        const nextExpiredTime = Date.parse(response.headers.date) + 5 * 60000;

                        storage.setItem('access.myblog', response.data.access);
                        storage.setItem('expiredTime.myblog', nextExpiredTime);
                        storage.removeItem('refresh.myblog');

                        that.hasLogin = true;
                    })
                    .catch(function () {
                        // .clear() 清空当前域名下所有的值
                        // 慎用
                        storage.clear();
                        that.hasLogin = false;
                    })
            }
            // 无任何有效 token
            else {
                storage.clear();
                that.hasLogin = false;
            }
        }
    }
</script>

<style scoped>
    .login-link {
        color: black;
    }

    .login {
        text-align: right;
        padding-right: 5px;
    }

    #header {
        text-align: center;
        margin-top: 20px;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
    }

    .search {
        padding-top: 22px;

    }

    /*https://blog.csdn.net/qq_39198420/article/details/77973339*/
    * {
        box-sizing: border-box;
    }

    form {
        position: relative;
        width: 200px;
        margin: 0 auto;
    }

    input, button {
        border: none;
        outline: none;
    }

    input {
        width: 100%;
        height: 35px;
        padding-left: 13px;
        padding-right: 46px;
    }

    button {
        height: 35px;
        width: 35px;
        cursor: pointer;
        position: absolute;
    }

    .search input {
        border: 2px solid gray;
        /*border: 2px solid #c5464a;*/
        border-radius: 5px;
        background: transparent;
        top: 0;
        right: 0;
    }

    .search button {
        background: gray;
        /*background: #c5464a;*/
        border-radius: 0 5px 5px 0;
        width: 45px;
        top: 0;
        right: 0;
    }

    .search button:before {
        content: "搜索";
        font-size: 13px;
        color: white;
    }

</style>