<template>

    <BlogHeader/>

    <div id="grid">
        <div id="login">
            <h3>注册账号</h3>
            <form>
                <div class="form-elem">
                    <span>账号：</span>
                    <input v-model="signupName" type="text" placeholder="输入用户名">
                </div>

                <div class="form-elem">
                    <span>密码：</span>
                    <input v-model="signupPwd" type="password" placeholder="输入密码">
                </div>

                <div class="form-elem">
                    <button v-on:click.prevent="signup">提交</button>
                </div>
            </form>
        </div>

        <div>
            <!-- 留给后面章节的登录 -->
        </div>
    </div>


    <BlogFooter/>

</template>

<script>
    import axios from 'axios';
    import BlogHeader from '@/components/BlogHeader.vue'
    import BlogFooter from '@/components/BlogFooter.vue'


    export default {
        name: 'Login',
        components: {BlogHeader, BlogFooter},
        data: function () {
            return {
                signupName: '',
                signupPwd: '',
                signupResponse: null,
            }
        },
        methods: {
            signup() {
                const that = this;
                axios
                    .post('/api/user/', {
                        username: this.signupName,
                        password: this.signupPwd,
                    })
                    .then(function (response) {
                        that.signupResponse = response.data;
                        alert('用户注册成功，快去登录吧！');
                    })
                    .catch(function (error) {

                        alert(error.message);

                        // Handling Error here...

                        // https://github.com/axios/axios#handling-errors

                    });
            },
        }
    }
</script>

<style scoped>

    #grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    #login {
        text-align: center;
    }

    .form-elem {
        padding: 10px;
    }

    input {
        height: 25px;
        padding-left: 10px;
    }

    button {
        height: 35px;
        cursor: pointer;
        border: none;
        outline: none;
        background: gray;
        color: whitesmoke;
        border-radius: 5px;
        width: 60px;
    }
</style>