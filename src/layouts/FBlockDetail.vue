<template>
    <div class="f-address-detail f-data-layout">
        <f-card>
            <template v-if="!blockByNumberError">
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.block') }}:</div>
                    <div class="col"><div class="break-word">{{ id }} {{ cBlock.number | formatHexToInt }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.timestamp') }}:</div>
                    <div class="col">
                        <div v-show="cBlock && ('timestamp' in cBlock)">{{ cBlock.timestamp }}</div>
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
                        <div v-show="cBlock && ('hash' in cBlock)">{{ cBlock.hash }}</div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.parent_hash') }}:</div>
                    <div class="col">
                        <div v-show="cBlock && cBlock.parent && ('hash' in cBlock.parent)">{{ cBlock.parent.hash }}</div>
                    </div>
                </div>
            </template>

            <template v-else>
                <f-card>
                    error {{ blockByNumberError }}
                </f-card>
            </template>
        </f-card>


    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM, FTMToUSD } from "../utils/transactions.js";
    import { formatHexToInt } from "../filters.js";

    export default {
        components: {
            FCard
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
/*
                query: gql`
                    query BlockByNumber {
                        block (number: "0x12c90") {
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
                            }
                        }
                    }
                `,
*/
                query: gql`
                    query BlockByNumber($num: Long) {
                        block (number: $num) {
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
                            }
                        }
                    }
                `,
                variables() {
                    // const eee = this.id;
                    // console.log('????', this.id, `0x${eee.toString(16)}`, formatHexToInt(`0x${eee.toString(16)}`), formatHexToInt("0x12c90"));
                    return {
                        // $number: `0x${parseInt(this.id).toString(16)}`
                        // $number: "0x12c90"
                        // $number: "0x" + eee.toString(16)
                        $num: this.id
                    }
                },
                error(_error) {
                    this.blockByNumberError = _error.message;
                }
            }
        },

        data() {
            return {
                blockByNumberError: ''
            }
        },

        computed: {
            cBlock() {
                return this.block || {parent: {}};
            }
        },

        methods: {
            WEIToFTM,
            FTMToUSD,
            formatHexToInt
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-address-detail {
        padding-top: 16px;

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
    }
</style>
