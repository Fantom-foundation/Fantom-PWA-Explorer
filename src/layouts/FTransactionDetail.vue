<template>
    <div class="f-transaction-detail f-data-layout">
        <f-card>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.transaction_hash') }}:</div>
                <div class="col"><div class="break-word">{{ id }}</div></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.sender') }}:</div>
                <div class="col"><div class="break-word" v-show="cTransaction">{{ cTransaction.from }}</div></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.recipient') }}:</div>
                <div class="col"><div class="break-word" v-show="cTransaction">{{ cTransaction.to }}</div></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.time_stamp') }}:</div>
                <div class="col">
                    <div class="break-word" v-show="cTransaction">
                        <timeago :datetime="cTransaction.block.timeStamp"></timeago>
                        ({{ new Date(cTransaction.block.timeStamp) }})
                    </div>
                </div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.transaction_fee') }}:</div>
                <div class="col"><div class="break-word" v-show="cTransaction">{{  WEIToFTM(cTransaction.fee) }}</div></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.block_number') }}:</div>
                <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.block.number }}</div></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.gas_used') }}:</div>
                <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.gasUsed }}</div></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.gas_limit') }}:</div>
                <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.gasLimit }}</div></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.gas_price') }}:</div>
                <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.gasPrice }}</div></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.nonce') }}:</div>
                <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransaction.nonce }}</div></div>
            </div>
        </f-card>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";

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
            blockchainTransaction: {
                query: gql`
                    query BlockchainTransaction($hash: ID!){
                        blockchainTransaction(hash: $hash){
                            hash
                            from
                            to
                            value
                            input
                            nonce
                            fee
                            gasLimit
                            gasUsed
                            gasPrice
                            txIndex
                            block {
                                hash
                                number
                                timeStamp
                            }
                        }
                    }
                `,
                variables() {
                    return {
                        hash: this.id
                    }
                }
            }
        },

        computed: {
            cTransaction() {
                return this.blockchainTransaction || {block: {}};
            },

/*
            cLoading() {
                return this.$apollo.queries.transaction.loading;
            }
*/
        },

        methods: {
            WEIToFTM
        }
    }
</script>

<style lang="scss">
    /*@import "../assets/scss/vars";*/
</style>
