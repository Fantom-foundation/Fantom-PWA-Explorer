<template>
    <div class="block-list-dt">
        <f-data-table
            :columns="columns"
            :items="cItems"
            :disable-infinite-scroll="cLoading || !hasNext"
            infinite-scroll
            fixed-header
            @fetch-more="fetchMore"
        >
            <template v-slot:column-age="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}:</div>
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
    import {timestampToDate, formatDate, formatHexToInt} from "../filters.js";

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
                error(_error) {
                    this.transactionByHashError = _error.message;
                }
            }
        },

        data() {
            return {
                cursor: null,
                hasNext: true
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
                        itemProp: 'block.transactionCount',
                        width: '80px'
                    }
                ]
            },

            cItems() {
                // console.log('blocks', this.blocks);
                return (this.blocks ? this.blocks.edges : []);
            },

            cLoading() {
                return this.$apollo.queries.blocks.loading;
            }
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
                            this.hasNext = fetchMoreResult.blocks.pageInfo.hasNext;

                            return {
                                blocks: {
                                    ...fetchMoreResult.blocks,
                                    edges: [...previousResult.blocks.edges, ...fetchMoreResult.blocks.edges]
                                }
                            }
                        }
                    });
                }
            },

            WEIToFTM,
            timestampToDate
        }
    }
</script>
