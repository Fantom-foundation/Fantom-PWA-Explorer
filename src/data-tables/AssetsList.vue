<template>
    <div class="assets-list-dt">
        <f-data-table
            :columns="columns"
            :items="items"
            first-m-v-column-width="6"
            :class="{ 'f-data-table-body-bg-color': defiAssetsList }"
        >
            <template v-slot:column-asset="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <f-crypto-symbol :token="item" />
                    </div>
                </div>
                <template v-else>
                    <f-crypto-symbol :token="item" />
                </template>
            </template>

            <template v-slot:column-balance="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        {{ value }}
                        <!-- <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span>-->
                    </div>
                </div>
                <template v-else>
                    {{ value }}
                    <!-- <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span>-->
                </template>
            </template>

            <template v-slot:column-borrowed="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        {{ value }}
                        <!-- <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span>-->
                    </div>
                </div>
                <template v-else>
                    {{ value }}
                    <!-- <span class="currency-light">{{ $defi.getTokenSymbol(item) }}</span>-->
                </template>
            </template>

            <template v-slot:column-actions="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-6 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <template v-if="item._collateral > 0">
                            <template v-if="usedInFMint(item) && item.symbol === 'WFTM'">
                                <router-link :to="{ name: 'defi-lock' }">Lock</router-link>,
                                <router-link :to="{ name: 'defi-unlock' }">Unlock</router-link>,
                                <router-link :to="{ name: 'defi-ftrade' }">Swap</router-link>
                            </template>
                        </template>
                        <template v-if="item._debt > 0">
                            <template v-if="usedInFMint(item) && item.symbol === 'FUSD'">
                                <router-link :to="{ name: 'defi-mint' }">Mint</router-link>,
                                <router-link :to="{ name: 'defi-repay' }">Repay</router-link>
                            </template>
                        </template>
                    </div>
                </div>
                <template v-else>
                    <template v-if="item._collateral > 0">
                        <template v-if="usedInFMint(item) && item.symbol === 'WFTM'">
                            <router-link :to="{ name: 'defi-lock' }">Lock</router-link>
                            <br />
                            <router-link :to="{ name: 'defi-unlock' }">Unlock</router-link>
                            <br />
                            <router-link :to="{ name: 'defi-ftrade' }">Swap</router-link>
                        </template>
                    </template>
                    <template v-if="item._debt > 0">
                        <template v-if="usedInFMint(item) && item.symbol === 'FUSD'">
                            <router-link :to="{ name: 'defi-mint' }">Mint</router-link>
                            <br />
                            <router-link :to="{ name: 'defi-repay' }">Repay</router-link>
                        </template>
                    </template>
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
import FDataTable from '../components/FDataTable.vue';
import FCryptoSymbol from '../components/core/FCryptoSymbol/FCryptoSymbol.vue';
import { stringSort } from '../utils/array-sorting.js';
import { formatNumberByLocale } from '../filters.js';

export default {
    name: 'AssetsList',

    components: { FCryptoSymbol, FDataTable },

    props: {
        /** @type {DefiToken[]} */
        tokens: {
            type: Array,
            required: true,
            default() {
                return [];
            },
        },
        /** @type {FMintAccount} */
        fMintAccount: {
            type: Object,
            required: true,
            default() {
                return {
                    collateral: [],
                    debt: [],
                };
            },
        },
        /** Assets list used in defi module. */
        defiAssetsList: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            items: [],
            /** @type {DeFi} */
            defi: this.$defi,
            columns: [
                {
                    name: 'asset',
                    label: 'Asset',
                    sortFunc: (_itemProp, _direction = 'asc') => {
                        return (_a, _b) => {
                            const a = _a.symbol;
                            const b = _b.symbol;

                            return (_direction === 'desc' ? -1 : 1) * stringSort(a, b);
                        };
                    },
                    sortDir: 'desc',
                    width: '140px',
                },
                {
                    name: 'available',
                    label: 'Available',
                    itemProp: 'availableBalance',
                    formatter: (_availableBalance, _item) => {
                        const balance = this.$defi.fromTokenValue(_availableBalance, _item);

                        return balance > 0 ? formatNumberByLocale(balance, this.defi.getTokenDecimals(_item)) : 0;
                    },
                    css: { textAlign: 'right' },
                    // width: '100px',
                },
                {
                    name: 'balance',
                    label: 'Deposited',
                    itemProp: 'availableBalance',
                    formatter: (_availableBalance, _item) => {
                        const collateral = this.getCollateral(_item);

                        return collateral > 0 ? formatNumberByLocale(collateral, this.defi.getTokenDecimals(_item)) : 0;
                    },
                    css: { textAlign: 'right' },
                    // width: '100px',
                },
                {
                    name: 'borrowed',
                    label: 'Borrowed',
                    hidden: !this.defiAssetsList,
                    formatter: (_value, _item) => {
                        const debt = this.getDebt(_item);

                        return debt > 0 ? formatNumberByLocale(debt, this.defi.getTokenDecimals(_item)) : 0;
                    },
                    css: { textAlign: 'right' },
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    hidden: !this.defiAssetsList,
                    width: '120px',
                },
            ],
        };
    },

    watch: {
        /**
         * @param {DefiToken[]} _value
         */
        tokens(_value) {
            this.items = _value.filter((_item) => _item.isActive && _item.canDeposit && _item.symbol !== 'FTM');

            this.$emit('records-count', this.items.length);
        },
    },

    methods: {
        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        getCollateral(_token) {
            /** @type {FMintTokenBalance} */
            const tokenBalance = this.$defi.getFMintAccountCollateral(this.fMintAccount, _token);

            return this.$defi.fromTokenValue(tokenBalance.balance, _token) || 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {*|number}
         */
        getDebt(_token) {
            /** @type {FMintTokenBalance} */
            const tokenBalance = this.$defi.getFMintAccountDebt(this.fMintAccount, _token);

            return this.$defi.fromTokenValue(tokenBalance.balance, _token) || 0;
        },

        /**
         * @param {DefiToken} _token
         * @return {boolean}
         */
        usedInFMint(_token) {
            return _token.symbol === 'WFTM' || _token.symbol === 'FUSD';
        },
    },
};
</script>
