<template>
    <div class="block-list-dt">
        <f-data-table
            :columns="columns"
            :items="cItems"
        >
            <template v-slot:column-age="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}:</div>
                    <div class="col"><timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago></div>
                </div>
                <template v-else>
                    <timeago :datetime="timestampToDate(value)" :auto-update="5" :converter-options="{includeSeconds: true}"></timeago>
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
    import FDataTable from "../components/FDataTable.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import { timestampToDate, formatHexToInt, formatDate } from "../filters.js";

    export default {
        components: {
            FDataTable
        },

        props: {
            itemsPerPage: {
                type: Number,
                default: 25
            }
        },

        apollo: {
            blocks: {
                query: gql`
                    query BlocksList($count: Int!) {
                        blocks (count: $count) {
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
                        count: this.itemsPerPage
                    }
                },
                error(_error) {
                    this.transactionByHashError = _error.message;
                }
            }
        },

        computed: {
            columns() {
                return [
                    {
                        name: 'block',
                        label: this.$t('view_block_list.block'),
                        itemProp: 'block.number',
                        formatter: formatHexToInt
                    },
                    {
                        name: 'time',
                        label: this.$t('view_block_list.time'),
                        itemProp: 'block.timestamp',
                        formatter: (_value) => formatDate(timestampToDate(_value))
                    },
                    {
                        name: 'age',
                        label: this.$t('view_block_list.age'),
                        itemProp: 'block.timestamp'
                    },
                    {
                        name: 'transaction_count',
                        label: this.$t('view_block_list.transaction_count'),
                        itemProp: 'block.transactionCount'
                    }
                ]
            },

            cItems() {
                // console.log('blocks', this.blocks);
                return (this.blocks ? this.blocks.edges : []);
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
        },

/*
        created() {
            this.columns = columns;
        },
*/

        methods: {
            WEIToFTM,
            timestampToDate
        }
    }
</script>
