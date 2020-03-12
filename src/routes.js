import Home from './views/Home.vue';
import NotFound from "./views/NotFound.vue";
import DataTablePlayground from "./views/DataTablePlayground.vue";
import Transactions from "./views/Transactions.vue";
import TransactionDetail from "./views/TransactionDetail.vue";
import AddressDetail from "./views/AddressDetail.vue";

export const routes = [
    {
        name: 'home',
        path: '/',
        component: Home
    },
    {
        name: 'transactions',
        path: '/transactions',
        component: Transactions
    },
    {
        name: 'transaction-detail',
        path: '/tx/:id',
        component: TransactionDetail
    },
    {
        name: 'address-detail',
        path: '/address/:id',
        component: AddressDetail
    },
    {
        name: 'data-table-playground',
        path: '/data-table-playground',
        component: DataTablePlayground
    },
    {
        name: 'not-found',
        path: '*',
        component: NotFound
    }
];
