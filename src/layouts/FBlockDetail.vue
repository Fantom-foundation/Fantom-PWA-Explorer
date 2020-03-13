<template>
    <div class="f-block-detail f-data-layout">
        <f-card>
            <template v-if="!blockByNumberError">
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.block') }}:</div>
                    <div class="col"><div class="break-word">{{ id }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.timestamp') }}:</div>
                    <div class="col">
                        <div v-show="cBlock && ('timestamp' in cBlock)">
                            <timeago :datetime="timestampToDate(cBlock.timestamp)"></timeago>
                            ({{ timestampToDate(cBlock.timestamp) }})
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.transactions') }}:</div>
                    <div class="col">
                        <div v-show="cBlock && ('transactionCount' in cBlock)">
                            <strong>{{ cBlock.transactionCount }}</strong> {{ $t('view_block_detail.transactions_in_block' )}}
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.block_hash') }}:</div>
                    <div class="col">
                        <div v-show="cBlock && ('hash' in cBlock)" class="break-word">{{ cBlock.hash }}</div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.parent_hash') }}:</div>
                    <div class="col">
                        <div v-show="cBlock && cBlock.parent && ('hash' in cBlock.parent)" class="break-word">{{ cBlock.parent.hash }}</div>
                    </div>
                </div>
            </template>

            <template v-else>
                <f-card>
                    error {{ blockByNumberError }}
                </f-card>
            </template>
        </f-card>

        <div class="block-transactions">
            <h2>{{ $t('view_block_detail.block_transactions') }}</h2>
            <f-transaction-list
                :items="cTransactionItems"
                :hidden-columns="['block']"
            ></f-transaction-list>
        </div>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import FTransactionList from "../data-tables/FTransactionList.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM, FTMToUSD } from "../utils/transactions.js";
    import { formatHexToInt, timestampToDate } from "../filters.js";

    export default {
        components: {
            FCard,
            FTransactionList
        },

        props: {
            /** Block number. */
            id: {
                type: Number,
                required: true,
                default: 0
            }
        },

        apollo: {
            block: {
                query: gql`
                    query BlockByNumber($number: Long) {
                        block (number: $number) {
                            number
                            transactionCount
                            hash
                            parent {
                                hash
                            }
                            timestamp
                            txList {
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
                `,
                variables() {
                    return {
                        number: `0x${parseInt(this.id).toString(16)}`
                    }
                },
                error(_error) {
                    this.blockByNumberError = _error.message;
                }
            }
        },

        data() {
            return {
                blockByNumberError: '',
                dTransactions: []
            }
        },

        computed: {
            cTransactionItems() {
                return (this.cBlock.txList ? this.cBlock.txList : [])
            },

            cBlock() {
/*
                if (this.block) {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.dTransactions = this.block.txList;
                }
*/

                return this.block || {parent: {}};
            }
        },

        methods: {
            WEIToFTM,
            FTMToUSD,
            formatHexToInt,
            timestampToDate
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-block-detail {
        .num-block {
            h2 {
                text-align: center;
                margin-top: 16px;
                margin-bottom: 4px;
            }

            .num {
                text-align: center;
                font-weight: bold;
                font-size: $fs48;
            }
        }

        .block-transactions {
            margin-top: 32px;

            .transaction-list-dt {
            }
        }
    }
</style>
