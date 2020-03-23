import Vue from 'vue';
import App from './App.vue'
import {router} from "@/plugins/router.js";
import {apolloProvider} from "@/plugins/apollo-provider.js";
import i18n from '@/plugins/i18n';
import '@/plugins/vue-timeago.js';
import '@/plugins/vue-svgicon.js';
import '@/plugins/vue-observe-visibility.js';
import {store} from "./store";
import './filters.js';
import './registerServiceWorker'


Vue.config.productionTip = false;

// measure performance
// Vue.config.performance = true;

new Vue({
    render: h => h(App),
    router,
    store,
    i18n,
    apolloProvider
}).$mount('#app');
