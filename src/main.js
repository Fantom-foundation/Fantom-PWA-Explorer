import Vue from 'vue';
import App from './App.vue'
import {router} from "./plugins/router.js";
import {apolloProvider, apolloClient} from "./plugins/apollo-provider.js";
import i18n from './plugins/i18n';
import './plugins/vue-timeago.js';
import './plugins/vue-svgicon.js';
import './plugins/vue-observe-visibility.js';
import './plugins/vue-async-computed.js';
import './plugins/dayjs.js';
import {store} from "./store";
import './filters.js';
import './registerServiceWorker'
import 'focus-visible';
import { DeFi } from './plugins/defi/defi.js';
import { FFetch } from "@/plugins/ffetch.js";

Vue.config.productionTip = false;

Vue.use(DeFi, {
    apolloClient,
});
Vue.use(FFetch);

// measure performance
// Vue.config.performance = true;

new Vue({
    render: h => h(App),
    router,
    store,
    i18n,
    apolloProvider
}).$mount('#app');
