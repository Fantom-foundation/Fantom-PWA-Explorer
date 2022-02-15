<template>
    <div class="transaction-list-dt">
        <template v-if="!dTransactionListError">
            <f-data-table
                :columns="dColumns"
                :hidden-columns="hiddenColumns"
                :items="dItems"
                :mobile-view="cMobileView"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                :f-card-off="fCardOff"
                first-m-v-column-width="5"
                infinite-scroll
                fixed-header
                v-bind="{...$attrs, ...$props}"
                class="f-data-table-body-bg-color"
                @fetch-more="onFetchMore"
            >
<!--
                <template v-slot:column-created="{ value, column }">
                    <template v-if="column">
                        {{ value | formatDate }}
                    </template>
                    <template v-else>
                        {{ value | formatDate }}
                    </template>
                </template>
-->

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

<!--
                <template v-slot:column-block="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col"><router-link :to="{name: 'block-detail', params: {id: value}}" :title="value">{{value}}</router-link></div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'block-detail', params: {id: value}}" :title="value">{{value}}</router-link>
                    </template>
                </template>
-->

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

                <template v-slot:column-from="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col"><router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link></div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                    </template>
                </template>

                <template v-slot:column-to="{ value, column }">
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

                <!--
                            <template v-slot:column-fee="{ value, column }">
                                <div v-if="column" class="row no-collapse no-vert-col-padding">
                                    <div class="col-5 f-row-label">{{ column.label }}</div>
                                    <div class="col">{{ WEIToFTM(value | formatHexToInt) }}</div>
                                </div>
                                <template v-else>
                                    {{ WEIToFTM(value | formatHexToInt) }}
                                </template>
                            </template>
                -->

                <template #subrow="{ item, columns, visibleColumnsNum, style, tabindex, dtItemId, mobileView }">
                    <template v-if="!mobileView">
                        <tr
                            v-if="filterApprovals(item.transaction.tokenTransactions).length > 0"
                            :style="style"
                            :tabindex="tabindex"
                            :data-dt-item-id="dtItemId"
                            class="subrow"
                        >
                            <td :colspan="visibleColumnsNum" class="tokentxstd">
                                <div class="tokentxs">
                                    <token-transactions-list
                                        :token-transactions="filterApprovals(item.transaction.tokenTransactions)"
                                        :address="addressCol"
                                    />
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <details v-if="filterApprovals(item.transaction.tokenTransactions).length > 0" class="tokentxs">
                            <summary>Details</summary>
                            <token-transactions-list
                                :token-transactions="filterApprovals(item.transaction.tokenTransactions)"
                                :address="addressCol"
                            />
                        </details>
                    </template>
                </template>
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ dTransactionListError }}</div>
        </template>
    </div>
</template>

<script>
    import FDataTable from "../components/core/FDataTable/FDataTable.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import {formatHexToInt, timestampToDate, numToFixed, formatNumberByLocale} from "../filters.js";
    import {getNestedProp} from "../utils";
    import FAccountTransactionAmount from "../components/FAccountTransactionAmount.vue";
    import FTokenValue from "@/components/core/FTokenValue/FTokenValue.vue";
    import TokenTransactionsList from "@/data-tables/TokenTransactionsList";

    export default {
        components: {
            FTokenValue,
            FAccountTransactionAmount,
            FDataTable,
            TokenTransactionsList,
        },

        props: {
            mobileView: {
                type: Boolean,
                default: false
            },

            /** No pagination, no 'transaction.' prefix on columns. */
            withoutCursor: {
                type: Boolean,
                default: false
            },

            /** Use address column instead of columns `from` and `to`. */
            addressCol: {
                type: String,
                default: ''
            },

            /** Array of column names to be hidden. */
            hiddenColumns: {
                type: Array,
                default() {
                    return [];
                }
            },

            /**
             * Data and action.
             * Actions:
             * '' - replace items
             * 'append' - append new items
             */
            items: {
                type: Object,
                default() {
                    return {
                        action: '',
                        data: []
                    };
                }
            },

            /** Number of items per page. */
            itemsPerPage: {
                type: Number,
                default: 40
            },

            /** Display loading message. */
            loading: {
                type: Boolean,
                default: false
            },

            /** If `true`, f-card element in data table will be without any style. */
            fCardOff: {
                type: Boolean,
                default: false
            }
        },

        apollo: {
            transactions: {
                query: gql`
                    query TransactionList($cursor: Cursor, $count: Int!) {
                        transactions (cursor: $cursor, count: $count) {
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            totalCount
                            edges {
                                cursor
                                transaction {
                                    hash
                                    from
                                    to
                                    value
                                    gasUsed
                                    block {
                                        number
                                        timestamp
                                    }
                                    tokenTransactions {
                                        trxIndex
                                        tokenAddress
                                        tokenName
                                        tokenSymbol
                                        tokenType
                                        tokenId
                                        tokenDecimals
                                        type
                                        sender
                                        recipient
                                        amount
                                    }
                                }
                            }
                        }
                    }
                `,
                variables() {
                    return {
                        cursor: null,
                        count: this.itemsPerPage
                    }
                },
                skip() {
                    return this.dOutsideData;
                },
                error(_error) {
                    this.dTransactionListError = _error.message;
                }
            }
        },

        data() {
            return {
                dItems: [],
                dHasNext: false,
                dOutsideData: !!this.items.action,
                dTransactionListError: '',
                dColumns: [
/*
                    {
                        name: 'created',
                        readValueFrom: 'timestamp',
                        hidden: !this.cMobileView
                    },
*/
                    {
                        name: 'hash',
                        label: this.$t('view_transaction_list.tx_hash'),
                        width: '200px',
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}hash`
                    },
/*
                    {
                        name: 'block',
                        label: this.$t('view_transaction_list.block'),
                        width: '100px',
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}block.number`,
                        formatter: formatHexToInt,
                        hidden: this.cMobileView
                    },
*/
                    {
                        name: 'timestamp',
                        label: this.$t('view_transaction_list.time'),
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}block.timestamp`,
                        // width: '220px',
                        hidden: this.cMobileView
                    },
                    {
                        name: 'address',
                        label: this.$t('view_transaction_list.address'),
                        // width: '460px',
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}from`,
                        formatter: (_value, _item) => {
                            // const from = getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}from`);
                            // const to = getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}to`);
                            const from = this.getFrom(_item);
                            const to = this.getTo(_item);

                            if (this.addressCol.toLowerCase() !== from.toLowerCase()) {
                                return from;
                            } else {
                                return to;
                            }
                        },
                        oneLineMode: true,
                        hidden: !this.addressCol
                        // width: '180px'
                    },
                    {
                        name: 'from',
                        label: this.$t('view_transaction_list.from'),
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}from`,
                        hidden: !!this.addressCol
                        // width: '180px'
                    },
                    {
                        name: 'to',
                        label: this.$t('view_transaction_list.to'),
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}to`,
                        hidden: !!this.addressCol
                        // width: '180px'
                    },
                    {
                        name: 'gasUsed',
                        label: this.$t('view_transaction_list.gas_used'),
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}gasUsed`,
                        formatter: (_value) => formatHexToInt(_value),
                        // width: '180px'
                    },
                    {
                        name: 'amount',
                        label: `${this.$t('view_transaction_list.amount')} (FTM)`,
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}value`,
                        formatter: _value => {
                            // return formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2)
                            return WEIToFTM(_value);
                        },
                        width: '150px',
                        css: {
                            textAlign: 'right'
                        }
                    }
/*
                    {
                        name: 'fee',
                        label: `${this.$t('view_transaction_list.fee')} (FTM)`,
                        itemProp: 'gasUsed',
                        width: '130px'
                    }
*/
                ]
            }
        },

        watch: {
            items(_newItems) {
                this.setItems(_newItems);
            },

            transactions(_data) {
                this.$emit('records-count', formatHexToInt(_data.totalCount));

                this.setItems({
                    action: (this.appendItems ? 'append' : 'replace'),
                    hasNext: _data.pageInfo.hasNext,
                    data: _data.edges
                });
            },

            /**
             * Watch route change and reset some properties, if only route parameter changes (whole component is reused,
             * not rendered from scratch!).
             *
             * @param {object} _to
             * @param {object} _from
             */
            $route(_to, _from) {
                if (_to.name === _from.name) {
                    this.appendItems = false;
                    this.dHasNext = false;
                }
            }
        },

        computed: {
            /**
             * Property is set to `true`, if 'transaction-list-dt-mobile-view' breakpoint is reached.
             *
             * @return {Boolean}
             */
            cMobileView() {
                const dataTableBreakpoint = this.$store.state.breakpoints['transaction-list-dt-mobile-view'];

                return (dataTableBreakpoint && dataTableBreakpoint.matches) || this.mobileView;
            },

            cLoading() {
                return this.loading || this.$apollo.queries.transactions.loading;
            }
        },

        created() {
            /** If `true`, transaction items will be appended. */
            this.appendItems = false;
        },

        methods: {
            setItems(_items) {
                const {action, data, hasNext} = _items;

                if (action === 'replace') {
                    this.dItems = data;
                } else if (action === 'append') {
                    for (let i = 0, len1 = data.length; i < len1; i++) {
                        this.dItems.push(data[i]);
                    }
                } else {
                    throw new Error(`Unknown items action '${action}'`);
                }

                this.dHasNext = !!hasNext;
            },

            /**
             * Get item's 'from' value.
             *
             * @param {Object} _item
             * @return {*}
             */
            getFrom(_item) {
                return getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}from`)
            },

            /**
             * Get item's 'to' value.
             *
             * @param {Object} _item
             * @return {*}
             */
            getTo(_item) {
                return getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}to`)
            },

            onFetchMore() {
                const {transactions} = this;

                if (this.dOutsideData) {
                    this.$emit('fetch-more');
                } else {
                    if (transactions && transactions.pageInfo && transactions.pageInfo.hasNext) {
                        const cursor = transactions.pageInfo.last;

                        this.$apollo.queries.transactions.fetchMore({
                            variables: {
                                cursor,
                                count: this.itemsPerPage
                            },
                            updateQuery: (previousResult, { fetchMoreResult }) => {
                                this.appendItems = true;

                                return fetchMoreResult;
                            }
                        });
                    }
                }
            },

            filterApprovals(tokenTransactions) {
                return tokenTransactions.filter(tx => tx.type !== 'APPROVAL');
            },

            WEIToFTM,
            timestampToDate,
            numToFixed,
            formatNumberByLocale
        }
    }
</script>

<style lang="scss">
.transaction-list-dt {

    .tokentxs {
        margin-top: -20px;
    }

    .tokentxs summary {
        cursor: pointer;
    }

    .token-transaction-item {
        margin-left: 200px;
    }

    .mobile-item {
        .tokentxs {
            margin-top: 0;

            .token-transaction-item {
                line-height: 0.8;
                margin-bottom: 16px;
                margin-left: 0;

                a {
                    max-width: 120px;
                }
            }
        }
    }
}
</style>
