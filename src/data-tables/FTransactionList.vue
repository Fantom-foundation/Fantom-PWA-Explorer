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
                infinite-scroll
                fixed-header
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
                        <div class="col-4 f-row-label">{{ column.label }}:</div>
                        <div class="col">
                            <router-link :to="{name: 'transaction-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                        </div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'transaction-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                    </template>
                </template>

                <template v-slot:column-block="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}:</div>
                        <div class="col"><router-link :to="{name: 'block-detail', params: {id: value}}" :title="value">{{value}}</router-link></div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'block-detail', params: {id: value}}" :title="value">{{value}}</router-link>
                    </template>
                </template>

                <template v-slot:column-timestamp="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}:</div>
                        <div class="col">
                            <timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                        </div>
                    </div>
                    <template v-else>
                        <timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                    </template>
                </template>

                <template v-slot:column-from="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}:</div>
                        <div class="col"><router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link></div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                    </template>
                </template>

                <template v-slot:column-to="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}:</div>
                        <div class="col"><router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link></div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                    </template>
                </template>

                <template v-slot:column-amount="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}:</div>
                        <div class="col">{{ formatNumberByLocale(numToFixed(WEIToFTM(value), 2), 2) }}</div>
                    </div>
                    <template v-else>
                        {{ formatNumberByLocale(numToFixed(WEIToFTM(value), 2), 2) }}
                    </template>
                </template>

                <!--
                            <template v-slot:column-fee="{ value, column }">
                                <div v-if="column" class="row no-collapse no-vert-col-padding">
                                    <div class="col-4 f-row-label">{{ column.label }}:</div>
                                    <div class="col">{{ WEIToFTM(value | formatHexToInt) }}</div>
                                </div>
                                <template v-else>
                                    {{ WEIToFTM(value | formatHexToInt) }}
                                </template>
                            </template>
                -->
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ dTransactionListError }}</div>
        </template>
    </div>
</template>

<script>
    import FDataTable from "../components/FDataTable.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import {formatHexToInt, timestampToDate, numToFixed, formatNumberByLocale} from "../filters.js";

    export default {
        components: {
            FDataTable
        },

        props: {
            /** No pagination, no 'transaction.' prefix on columns. */
            withoutCursor: {
                type: Boolean,
                default: false
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
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}hash`,
                        oneLineMode: true
                    },
                    {
                        name: 'block',
                        label: this.$t('view_transaction_list.block'),
                        width: '100px',
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}block.number`,
                        formatter: formatHexToInt,
                        hidden: this.cMobileView
                    },
                    {
                        name: 'timestamp',
                        label: this.$t('view_transaction_list.time'),
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}block.timestamp`,
                        // width: '220px',
                        hidden: this.cMobileView
                    },
                    {
                        name: 'from',
                        label: this.$t('view_transaction_list.from'),
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}from`
                        // width: '180px'
                    },
                    {
                        name: 'to',
                        label: this.$t('view_transaction_list.to'),
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}to`
                        // width: '180px'
                    },
                    {
                        name: 'amount',
                        label: `${this.$t('view_transaction_list.amount')} (FTM)`,
                        itemProp: `${!this.withoutCursor ? 'transaction.' : ''}value`,
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
             * Property is set to `true`, if 'ttransaction-list-dt-mobile-view' breakpoint is reached.
             *
             * @return {Boolean}
             */
            cMobileView() {
                const dataTableBreakpoint = this.$store.state.breakpoints['transaction-list-dt-mobile-view'];

                return (dataTableBreakpoint && dataTableBreakpoint.matches);
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

            WEIToFTM,
            timestampToDate,
            numToFixed,
            formatNumberByLocale
        }
    }
</script>
