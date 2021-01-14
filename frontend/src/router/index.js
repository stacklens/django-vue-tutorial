import {createWebHistory, createRouter} from "vue-router";
import Home from "@/views/Home.vue";
import ArticleDetail from "@/views/ArticleDetail.vue";
import Login from "@/views/Login.vue";
import UserCenter from "@/views/UserCenter.vue";

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
];

const router = createRouter({
    // https://next.router.vuejs.org/guide/essentials/history-mode.html
    history: createWebHistory(),
    routes,
});

export default router;