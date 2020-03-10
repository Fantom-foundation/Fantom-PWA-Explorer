import Vue from 'vue';
import VueRouter from "vue-router";
import { routes } from "../routes.js";

Vue.use(VueRouter);


export const router = new VueRouter({
    routes,
    scrollBehavior (_to, _from, _savedPosition) {
        if (_savedPosition) {
            return _savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
    // mode: 'history'
});
