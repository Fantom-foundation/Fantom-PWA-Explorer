import Vue from 'vue';
import VueRouter from "vue-router";
import { routes } from "./routes.js";

Vue.use(VueRouter);


export const router = new VueRouter({
    routes
    // mode: 'history'
});
