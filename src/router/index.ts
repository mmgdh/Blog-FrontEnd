import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    // {
    //     path: "/",
    //     name: 'waiting',
    //     component: () => import('../components/Blog/BlogMain.vue'),
    // },
    {
        path: "/BlogManage",
        name: 'BlogManage',
        component: () => import('../components/Background/Manage.vue'),
        children: [
            {
                path: "/ArticleManage",
                name: 'ArticleManage',
                component: () => import('../components/Background/ArticleManage.vue')
            },
            {
                path: "/EditBlog",
                name: 'EditBlog',
                component: () => import('../components/Background/EditBlog.vue')
            },
            {
                path: "/TagManage",
                name: 'TagManage',
                component: () => import('../components/Background/TagManage.vue')
            },
            {
                path: "/ClassifyManage",
                name: 'ClassifyManage',
                component: () => import('../components/Background/ClassifyManage.vue')
            },
            {
                path: "/BlogParameter",
                name: 'BlogParameter',
                component: () => import('../components/Background/BlogParamManage.vue')
            }
        ]
    },
    {
        path: "/",
        name: "BlogMain",
        component: () => import('../components/Blog/BlogMain.vue'),
        redirect:'BlogIndex',
        children: [
            {
                path: "/BlogIndex",
                name: "BlogIndex",
                component: () => import('../components/Blog/BlogContent/BlogIndex.vue'),
            },
            {
                path: "/ShowArticle",
                name: "ShowArticle",
                component: () => import('../components/Blog/Article/ShowArticle.vue')
            },
        ]
    },
    {
        path: "/Login",
        name: "Login",
        component: () => import('../components/User/Login.vue')
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})