<template>
    <div class="f-transaction-detail">
        <f-card>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.transaction_hash') }}:</div>
                <div class="col"><div class="three-dots">{{ id }}</div></div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.sender') }}:</div>
                <div class="col"><div class="three-dots" v-if="cTransation">{{ cTransation.from }}</div></div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.recipient') }}:</div>
                <div class="col"><div class="three-dots" v-if="cTransation">{{ cTransation.to }}</div></div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.time_stamp') }}:</div>
                <div class="col">
                    <div class="three-dots" v-if="cTransation">
                        <timeago :datetime="cTransation.block.timeStamp"></timeago>
                        ({{ new Date(cTransation.block.timeStamp) }})
                    </div>
                </div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.transaction_fee') }}:</div>
                <div class="col"><div class="three-dots" v-if="cTransation">{{  WEIToFTM(cTransation.fee) }}</div></div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.block_number') }}:</div>
                <div class="col"><div class="three-dots" v-if="cTransation">{{  cTransation.block.number }}</div></div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.gas_used') }}:</div>
                <div class="col"><div class="three-dots" v-if="cTransation">{{  cTransation.gasUsed }}</div></div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.gas_limit') }}:</div>
                <div class="col"><div class="three-dots" v-if="cTransation">{{  cTransation.gasLimit }}</div></div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.gas_price') }}:</div>
                <div class="col"><div class="three-dots" v-if="cTransation">{{  cTransation.gasPrice }}</div></div>
            </div>
            <div class="row collapse-md">
                <div class="col-3 f-row-label">{{ $t('transaction_detail.nonce') }}:</div>
                <div class="col"><div class="three-dots" v-if="cTransation">{{  cTransation.nonce }}</div></div>
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
            cTransation() {
                return this.blockchainTransaction || {};
            },

            cLoading() {
                return this.$apollo.queries.transaction.loading;
            }
        },

        methods: {
            WEIToFTM
        }
    }
</script>

<style lang="scss">
    /*@import "../assets/scss/vars";*/
    .f-transaction-detail {
        .f-row-label {
            color: #666;
            font-weight: bold;
            /*font-style: italic;*/
        }
    }
</style>
