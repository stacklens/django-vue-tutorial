<template>
    <div id="header">
        <div class="grid">
            <div></div>
            <h1>My Drf-Vue Blog</h1>
            <!--引入搜索框组件-->
            <SearchButton/>
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
    import SearchButton from '@/components/SearchButton.vue'

    export default {
        name: 'BlogHeader',
        components: {SearchButton},
        data: function () {
            return {
                username: '',
                hasLogin: false,
                // searchText 变量删除
            }
        },
        // methods 删除掉了
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

                        const nextExpiredTime = Date.parse(response.headers.date) + 60 * 60000;

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
    /*与搜索框相关的 css 删除*/

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
</style>