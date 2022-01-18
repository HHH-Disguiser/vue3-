import {
    createRouter,
    createWebHashHistory,
    RouteRecordRaw,
} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue')
    },
    {
        path: '/vuex',
        name: 'Vuex',
        component: () => import(/* webpackChunkName: "home" */ '@/views/vuex.vue')
    },
    {
        path: '/axios',
        name: 'Axios',
        component: () => import('@/views/axios.vue') // 懒加载组件
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router