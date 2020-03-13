<template>
    <div class="f-address-detail">
        <template v-if="!accountByAddressError">
            <f-card>
                <h2 class="break-word">{{ id }}</h2>
                <div class="row">
                    <div class="col-5 offset-1 no-offset-sm">
                        <div class="num-block">
                            <h2 class="h3">{{ $t('view_address_detail.value_in_ftm') }}</h2>
                            <div class="num"><span v-show="cAccount">{{ Number(WEIToFTM(cAccount ? cAccount.balance : 1)).toFixed(2) }}</span></div>
                        </div>
                    </div>
                    <div class="col-5">
                        <div class="num-block">
                            <h2 class="h3">{{ $t('view_address_detail.value_in_usd') }}</h2>
                            <div class="num"><span v-show="cAccount">{{ Number(FTMToUSD(WEIToFTM(cAccount ? cAccount.balance : 1))).toFixed(3) }}</span></div>
                        </div>
                    </div>
                </div>
            </f-card>
        </template>
        <template v-else>
            <f-card>
                error {{ accountByAddressError }}
            </f-card>
        </template>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM, FTMToUSD } from "../utils/transactions.js";

    export default {
        components: {
            FCard
        },

        props: {
            /** Address id. */
            id: {
                type: String,
                required: true,
                default: ''
            }
        },

        apollo: {
            account: {
                query: gql`
                    query AccountByAddress($address: Address!) {
                        account (address: $address) {
                            address
                            balance
                            txCount
                        }
                    }
                `,
                variables() {
                    return {
                        address: this.id
                    }
                },
                error(_error) {
                    this.accountByAddressError = _error.message;
                }
            }
        },

        data() {
            return {
                accountByAddressError: ''
            }
        },

        computed: {
            cAccount() {
                return this.account;
            }
        },

        methods: {
            WEIToFTM,
            FTMToUSD
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-address-detail {
        /*padding-top: 16px;*/

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
