import {createWebHistory, createRouter} from "vue-router";
import Home from "@/views/Home.vue";
import ArticleDetail from "@/views/ArticleDetail.vue";
import Login from "@/views/Login.vue";
import UserCenter from "@/views/UserCenter.vue";
import ArticleCreate from "@/views/ArticleCreate.vue";
import ArticleEdit from "@/views/ArticleEdit.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/article/:id",
        name: "ArticleDetail",
        component: ArticleDetail
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/user/:username",
        name: "UserCenter",
        component: UserCenter
    },
    {
        path: "/article/create",
        name: "ArticleCreate",
        component: ArticleCreate
    },
    {
        path: "/article/edit/:id",
        name: "ArticleEdit",
        component: ArticleEdit
    },
];

const router = createRouter({
    // https://next.router.vuejs.org/guide/essentials/history-mode.html
    history: createWebHistory(),
    routes,
});

export default router;