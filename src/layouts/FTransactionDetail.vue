<template>
    <div class="f-transaction-detail f-data-layout">
        <f-card>
            <template v-if="!transactionByHashError">
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.hash') }}:</div>
                    <div class="col"><div class="break-word">{{ id }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.status') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{ cTransaction.status | formatHexToInt }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.from') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{ cTransaction.from }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.to') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{ cTransaction.to }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.time') }}:</div>
                    <div class="col">
                        <div class="break-word" v-show="cTransaction && cTransaction.block.timestamp">
                            <timeago :datetime="timestampToDate(cTransaction.block.timestamp)"></timeago>
                            ({{ timestampToDate(cTransaction.block.timestamp) }})
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.amount') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{  WEIToFTM(cTransaction.value) }} FTM</div></div>
                </div>
                <!--
                            <div class="row no-collapse">
                                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.fee') }}:</div>
                                <div class="col"><div class="break-word" v-show="cTransaction">{{  WEIToFTM(cTransaction.fee) }} FTM</div></div>
                            </div>
                -->
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.block') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.block.number | formatHexToInt }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.gas_used') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.gasUsed | formatHexToInt }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.gas_limit') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.gas | formatHexToInt }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.gas_price') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.gasPrice | formatHexToInt }} WEI</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.nonce') }}:</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.nonce | formatHexToInt }}</div></div>
                </div>
            </template>
            <template v-else>
                error message: {{ transactionByHashError }}
            </template>
        </f-card>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import { formatHexToInt, timestampToDate } from "../filters.js";

    export default {
        components: {
            FCard
        },

        props: {
            /** Transaction id */
            id: {
                type: String,
                required: true,
                default: ''
            }
        },

        apollo: {
            transaction: {
                query: gql`
                    query TransactionByHash($hash: Hash!) {
                        transaction (hash: $hash) {
                            hash
                            index
                            nonce
                            from
                            sender {
                                address
                                balance
                            }
                            to
                            recipient {
                                address
                                balance
                            }
                            value
                            gas
                            gasUsed
                            gasPrice
                            inputData
                            status
                            blockHash
                            blockNumber
                            block {
                                hash
                                number
                                timestamp
                                transactionCount
                                txList {
                                    hash
                                    index
                                    from
                                    to
                                    nonce
                                }
                            }
                        }
                    }
                `,
                variables() {
                    return {
                        hash: this.id
                    }
                },
                error(_error) {
                    this.transactionByHashError = _error.message;
                }
            }
        },

        data() {
            return {
                transactionByHashError: ''
            }
        },

        computed: {
            cTransaction() {
                console.log((this.transaction ? new Date(this.formatHexToInt(this.transaction.block.timestamp)) : ''));
                return this.transaction || {block: {}};
            },

/*
            cLoading() {
                return this.$apollo.queries.transaction.loading;
            }
*/
        },

        methods: {
            WEIToFTM,
            formatHexToInt,
            timestampToDate
        }
    }
</script>

<style lang="scss">
    /*@import "../assets/scss/vars";*/
</style>
