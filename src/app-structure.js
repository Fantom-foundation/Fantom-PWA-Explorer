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
                    },
                    {
                        id: 'tx-detail',
                        translation: 'view_transaction_detail.title'
                    }
                ]
            },
            {
                id: 'address-detail',
                translation: 'view_address_detail.title'
            },
            {
                id: 'blocks',
                translation: 'view_block_list.title',
                _c: [
                    {
                        id: 'block-detail',
                        translation: 'view_block_detail.title'
                    }
                ]
            },
            {
                id: 'staking',
                translation: 'view_validator_list.title',
                _c: [
                    {
                        id: 'validator-detail',
                        translation: 'view_validator_detail.title'
                    }
                ]
            },
            {
                id: 'assets',
                translation: 'view_assets.title',
                _c: [
                    {
                        id: 'asset-detail',
                        translation: 'view_assets.title_detail',
                    }
                ]
            },
            {
                id: 'contracts',
                translation: 'view_contract_list.title',
            },
        ]
    }
];

export const appStructureTree = new Tree(appStructure);
