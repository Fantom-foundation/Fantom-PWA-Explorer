import Maintenance from '@/views/Maintenance/Maintenance.vue';

export const routes = [
    /*
    {
        path: '*',
        redirect: { name: 'maintenance' },
    },
*/
    {
        name: 'maintenance',
        // path: '/maintenance',
        path: '*',
        component: Maintenance,
    },
];
