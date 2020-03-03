import Vue from 'vue';
import VueRouter from "vue-router";
import Home from './views/Home.vue';
import NotFound from "./views/NotFound.vue";
import DataTablePlayground from "./views/DataTablePlayground.vue";
import ApolloDataTablePlayground from "./views/ApolloDataTablePlayground.vue";

Vue.use(VueRouter);

const routes = [
    {
        name: 'home',
        path: '/',
        component: Home
    },
    {
        name: 'data-table-playground',
        path: '/data-table-playground',
        component: DataTablePlayground
    },
    {
        name: 'apollo-data-table-playground',
        path: '/apollo-data-table-playground',
        component: ApolloDataTablePlayground
    },
    {
        name: 'not-found',
        path: '*',
        component: NotFound
    },
];

export const router = new VueRouter({
    routes
    // mode: 'history'
});
