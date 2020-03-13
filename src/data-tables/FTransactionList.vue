<template>
    <div class="transaction-list-dt">
        <f-data-table
            :columns="dColumns"
            :hidden-columns="hiddenColumns"
            :items="cItems"
            :mobile-view="cMobileView"
            :disable-infinite-scroll="!dHasNext"
            infinite-scroll
            fixed-header
            @fetch-more="fetchMore"
        >
            <template v-slot:column-created="{ value, column }">
                <template v-if="column">
                    {{ value | formatDate }}
                </template>
                <template v-else>
                    {{ value | formatDate }}
                </template>
            </template>

            <template v-slot:column-hash="{ value, column }">
                <div v-if="column" class="three-dots">
                    <router-link :to="{name: 'transaction-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
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
                    <div class="col">{{ WEIToFTM(value) }}</div>
                </div>
                <template v-else>
                    {{ WEIToFTM(value) }}
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
    </div>
</template>

<script>
    import FDataTable from "../components/FDataTable.vue";
    // import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import {formatHexToInt, timestampToDate} from "../filters.js";

    export default {
        components: {
            FDataTable
        },

        props: {
            /** Array of column names to be hidden. */
            hiddenColumns: {
                type: Array,
                default() {
                    return [];
                }
            },

            /** Data. */
            items: {
                type: Array,
                default() {
                    return [];
                }
            },

            /** */
            itemsPerPage: {
                type: Number,
                default: 40
            }
        },

/*
        apollo: {
            blocks: {
                query: gql`
                    query BlocksList($cursor: Cursor, $count: Int!) {
                        blocks (cursor: $cursor, count: $count) {
                            totalCount
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            edges {
                                block {
                                    hash
                                    number
                                    timestamp
                                    transactionCount
                                }
                                cursor
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
                skip () {
                    return (this.items.length > 0);
                },
                error(_error) {
                    this.transactionByHashError = _error.message;
                }
            }
        },
*/

        data() {
            return {
                dItems: null,
                dHasNext: false,
                dColumns: [
                    {
                        name: 'created',
                        readValueFrom: 'timestamp',
                        hidden: !this.cMobileView
                    },
                    {
                        name: 'hash',
                        label: this.$t('view_transaction_list.tx_hash'),
                        width: '200px',
                        oneLineMode: true
                    },
                    {
                        name: 'block',
                        label: this.$t('view_transaction_list.block'),
                        width: '100px',
                        itemProp: 'block.number',
                        formatter: formatHexToInt,
                        hidden: this.cMobileView
                    },
                    {
                        name: 'timestamp',
                        label: this.$t('view_transaction_list.time'),
                        itemProp: 'block.timestamp',
                        // width: '220px',
                        hidden: this.cMobileView
                    },
                    {
                        name: 'from',
                        label: this.$t('view_transaction_list.from')
                        // width: '180px'
                    },
                    {
                        name: 'to',
                        label: this.$t('view_transaction_list.to')
                        // width: '180px'
                    },
                    {
                        name: 'amount',
                        label: `${this.$t('view_transaction_list.amount')} (FTM)`,
                        itemProp: 'value',
                        width: '150px'
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

/*
        watch: {
            blocks() {
                const edges = this.blocks.edges;

                if (this.dItems.length === 0) {
                    this.dItems = edges;
                } else {
                    for (let i = 0, len1 = edges.length; i < len1; i++) {
                        this.dItems.push(edges[i]);
                    }
                }
            }
        },
*/

        computed: {
            cItems() {
                return this.dItems || this.items;
            },

            /**
             * Property is set to `true`, if 'ttransaction-list-dt-mobile-view' breakpoint is reached.
             *
             * @return {Boolean}
             */
            cMobileView() {
                const dataTableBreakpoint = this.$store.state.breakpoints['transaction-list-dt-mobile-view'];

                return (dataTableBreakpoint && dataTableBreakpoint.matches);
            }

/*
            cLoading() {
                return this.$apollo.queries.blocks.loading;
            }
*/
        },

        methods: {
            fetchMore() {
                const {blocks} = this;

                if (blocks && blocks.pageInfo && blocks.pageInfo.hasNext) {
                    const cursor = blocks.pageInfo.last;

                    this.$apollo.queries.blocks.fetchMore({
                        variables: {
                            cursor,
                            count: this.itemsPerPage
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                            this.dHasNext = fetchMoreResult.blocks.pageInfo.hasNext;

                            return fetchMoreResult;
/*
                            return {
                                blocks: {
                                    ...fetchMoreResult.blocks,
                                    edges: [...previousResult.blocks.edges, ...fetchMoreResult.blocks.edges]
                                }
                            }
*/
                        }
                    });
                }
            },

            WEIToFTM,
            timestampToDate
        }
    }
</script>
