
<template>
    <div class="address-asset-list-dt">
        <div v-if="error" class="query-error">{{ error }}</div>

        <f-data-table
            :columns="columns"
            :items="items"
            :loading="loading"
            :disable-infinite-scroll="!pageInfo.hasNext"
            :mobile-view="cMobileView"
            infinite-scroll
            first-m-v-column-width="5"
            class="f-data-table-body-bg-color"
            @fetch-more="fetchMore"
        >
            <template v-slot:column-hash="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}</div>
                    <div class="col">
                        <router-link :to="{name: 'transaction-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                    </div>
                </div>
                <template v-else>
                    <router-link :to="{name: 'transaction-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                </template>
            </template>

            <template v-slot:column-timestamp="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}</div>
                    <div class="col">
                        <timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                    </div>
                </div>
                <template v-else>
                    <timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                </template>
            </template>

            <template v-slot:column-address="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}</div>
                    <div class="col"><router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link></div>
                </div>
                <template v-else>
                    <router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                </template>
            </template>

            <template v-slot:column-amount="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}</div>
                    <div class="col">
                        <template v-if="addressCol">
                            <f-account-transaction-amount
                                :address="addressCol"
                                :from="getFrom(item)"
                                :to="getTo(item)"
                                :amount="value"
                            />
                        </template>
                        <template v-else>
                            <f-token-value :value="value" :decimals="2" :use-placeholder="false" no-currency />
                        </template>
                    </div>
                </div>
                <template v-else>
                    <template v-if="addressCol">
                        <f-account-transaction-amount
                            :address="addressCol"
                            :from="getFrom(item)"
                            :to="getTo(item)"
                            :amount="value"
                        />
                    </template>
                    <template v-else>
                        <f-token-value :value="value" :decimals="2" :use-placeholder="false" no-currency />
                    </template>
                </template>
            </template>

            <template v-slot:column-token="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}</div>
                    <div class="col">
                        <div class="smalltoken">
                            <f-crypto-symbol :token="value" no-symbol img-width="16px" img-height="16px" /> {{ value.name }} ({{ value.symbol }})
                        </div>
                    </div>
                </div>
                <template v-else>
                    <div class="smalltoken">
                        <f-crypto-symbol :token="value" no-symbol img-width="16px" img-height="16px" /> {{ value.name }} ({{ value.symbol }})
                    </div>
<!--                    <router-link :to="{name: 'asset-detail', params: {address: value.address}}" :title="value">
                        <f-crypto-symbol :token="value" no-symbol img-width="16px" img-height="16px" /> {{ value.name }} ({{ value.symbol }})
                    </router-link>-->
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
import FDataTable from '../components/core/FDataTable/FDataTable.vue';
import {formatHexToInt, timestampToDate} from "@/filters.js";
import {cloneObject, getNestedProp} from '@/utils';
import gql from "graphql-tag";
import FAccountTransactionAmount from "@/components/FAccountTransactionAmount.vue";
import FTokenValue from "@/components/core/FTokenValue/FTokenValue.vue";
import FCryptoSymbol from "@/components/core/FCryptoSymbol/FCryptoSymbol.vue";
import {ERC20_TRANSACTION_TYPE} from "@/constants/transaction-types.js";
// import { stringSort } from '../utils/array-sorting.js';
// import { formatNumberByLocale } from '../filters.js';

export default {
    name: 'Erc20TransationList',

    components: {FCryptoSymbol, FTokenValue, FAccountTransactionAmount, FDataTable },

    props: {
        address: {
            type: String,
            default: '',
            required: true,
        },
        delay: {
            type: Number,
            default: 0,
        }
    },

    data() {
        return {
            items: [],
            columns: [
                {
                    name: 'hash',
                    label: this.$t('view_transaction_list.tx_hash'),
                    width: '200px',
                    itemProp: 'trx.trxHash',
                },
                {
                    name: 'timestamp',
                    label: this.$t('view_transaction_list.time'),
                    itemProp: 'trx.timeStamp',
                    // width: '220px',
                    hidden: this.cMobileView
                },
                {
                    name: 'address',
                    label: this.$t('view_transaction_list.address'),
                    // width: '460px',
                    itemProp: 'trx.sender',
                    formatter: (_value, _item) => {
                        const from = this.getFrom(_item);
                        const to = this.getTo(_item);

                        if (this.addressCol.toLowerCase() !== from.toLowerCase()) {
                            return from;
                        } else {
                            return to;
                        }
                    },
                    oneLineMode: true,
                    // hidden: !this.addressCol
                    // width: '180px'
                },
                {
                    name: 'amount',
                    label: `${this.$t('view_transaction_list.amount')}`,
                    itemProp: 'trx.amount',
                    formatter: (value, item) => {
                        // return formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2)
                        return this.$defi.fromTokenValue(value, item.trx.token);
                    },
                    width: '150px',
                    css: {
                        textAlign: 'end'
                    }
                },
                {
                    name: 'type',
                    label: 'Type',
                    itemProp: 'trx.trxType',
                    formatter: (value) => {
                        return this.$t(ERC20_TRANSACTION_TYPE[value] || '');
                    },
                },
                {
                    name: 'token',
                    label: this.$t('token'),
                    itemProp: 'trx.token',
                    width: '250px',
                },
            ],
            pageInfo: {},
            error: '',
            loading: false,
            addressCol: this.address,
        };
    },

    computed: {
        /**
         * Property is set to `true`, if 'transaction-list-dt-mobile-view' breakpoint is reached.
         *
         * @return {Boolean}
         */
        cMobileView() {
            const dataTableBreakpoint = this.$store.state.breakpoints['transaction-list-dt-mobile-view'];

            return dataTableBreakpoint && dataTableBreakpoint.matches;
        },
    },

    watch: {
        address() {
            this.loadData();
        }
    },

    created() {
        if (this.delay > 0) {
            this.loading = true;
            setTimeout(() => { this.loadData(); }, this.delay);
        } else {
            this.loadData();
        }
    },

    methods: {
        async loadData(cursor = '') {
            this.loading = true;

            try {
                const data = cloneObject(await this.fetchTransations(cursor));
                const edges = data.edges;

                if (edges && edges.length > 0 && edges[0].id && this.items.length > 0) {
                    this.loading = false;
                    return;
                }

                if (edges && edges.length === 0) {
                    this.loading = false;
                }

                this.pageInfo = cloneObject(data.pageInfo);

                if (this.items.length === 0 || !cursor) {
                    this.items = edges;
                } else {
                    for (let i = 0, len1 = edges.length; i < len1; i++) {
                        this.items.push(edges[i]);
                    }
                }

                this.$emit('records-count', formatHexToInt(data.totalCount));

                // this.loading = false;
            } catch (_error) {
                this.loading = false;
                this.error = _error;
            }

        },

        async fetchTransations(cursor) {
            const data = await this.$apollo.query({
                query: gql`
                    query GetERC20Transactions($address: Address!, $cursor: Cursor, $count: Int!) {
                        account (address: $address) {
                            address
                            erc20TxList(cursor: $cursor, count: $count) {
                                pageInfo {
                                    first
                                    last
                                    hasNext
                                    hasPrevious
                                }
                                totalCount
                                edges {
                                    cursor
                                    trx {
                                        trxHash
                                        sender
                                        recipient
                                        amount
                                        timeStamp
                                        trxType
                                        token {
                                            address
                                            name
                                            symbol
                                            decimals
                                            logoURL
                                        }
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: {
                    address: this.address,
                    count: 20,
                    cursor: cursor || null
                },
                fetchPolicy: 'network-only',
            });

            return data.data.account.erc20TxList || {};
        },

        fetchMore() {
            if (this.pageInfo.hasNext) {
                this.loadData(this.pageInfo.last);
            }
        },

        /**
         * Get item's 'from' value.
         *
         * @param {Object} _item
         * @return {*}
         */
        getFrom(_item) {
            return getNestedProp(_item, 'trx.sender')
        },

        /**
         * Get item's 'to' value.
         *
         * @param {Object} _item
         * @return {*}
         */
        getTo(_item) {
            return getNestedProp(_item, 'trx.recipient')
        },

        timestampToDate,
    },
};
</script>
