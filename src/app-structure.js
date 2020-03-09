import {Tree} from "./utils/tree.js";

/**
 * App structure. Used for breadcrumbs rendering.
 *
 * One item is object:
 * `id` {string} - route name (from src/routes.js)
 * `translation` {string} - translation code (used in src/locales/*.json)
 * `_c` (array) - children
 */
const appStructure = [
    {
        id: 'home',
        translation: 'view_home.title',  // translation code (locales/*.json)
        _c: [
            {
                id: 'transactions',
                translation: 'view_transaction_list.title',
                _c: [
                    {
                        id: 'transaction-detail',
                        translation: 'view_transaction_detail.title'
                    }
                ]
            },
        ]
    }
];

export const appStructureTree = new Tree(appStructure);
