<template>
    <div class="f-address-detail">
        <template v-if="!dAccountByAddressError">
            <f-card>
                <h2 class="break-word">{{ id }}</h2>
                <div class="row">
                    <div class="col">
                        <div class="num-block">
                            <h2 class="h3">{{ $t('view_address_detail.value_in_ftm') }}</h2>
                            <div class="num"><span v-show="cAccount">{{ Number(WEIToFTM(cAccount ? cAccount.balance : 1)).toFixed(2) }}</span></div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="num-block">
                            <h2 class="h3">{{ $t('view_address_detail.value_in_usd') }}</h2>
                            <div class="num"><span v-show="cAccount">{{ Number(FTMToUSD(WEIToFTM(cAccount ? cAccount.balance : 1))).toFixed(3) }}</span></div>
                        </div>
                    </div>
                </div>
            </f-card>

            <div class="address-transactions">
                <h2 class="no-margin">{{ $t('view_block_detail.block_transactions') }} <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h2>
                <f-transaction-list
                    :items="cTransactionItems"
                    :loading="cLoading"
                    @fetch-more="onFetchMore"
                ></f-transaction-list>
            </div>
        </template>
        <template v-else>
            <f-card>
                error {{ dAccountByAddressError }}
            </f-card>
        </template>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM, FTMToUSD } from "../utils/transactions.js";
    import FTransactionList from "../data-tables/FTransactionList.vue";
    import {formatHexToInt} from "../filters.js";

    export default {
        components: {
            FTransactionList,
            FCard
        },

        props: {
            /** Address id. */
            id: {
                type: String,
                required: true,
                default: ''
            },

            /** */
            itemsPerPage: {
                type: Number,
                default: 20
            }
        },

        apollo: {
            account: {
                query: gql`
                    query AccountByAddress($address: Address!, $cursor: Cursor, $count: Int!) {
                        account (address: $address) {
                            address
                            balance
                            txCount
                            txList(cursor: $cursor, count: $count) {
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
                    }
                `,
                variables() {
                    return {
                        address: this.id,
                        count: this.itemsPerPage,
                        cursor: null
                    }
                },
                error(_error) {
                    this.dAccountByAddressError = _error.message;
                }
            }
        },

        data() {
            return {
                dRecordsCount: 0,
                dAccountByAddressError: ''
            }
        },

        watch: {
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
                }
            }
        },

        computed: {
            cAccount() {
                return this.account;
            },

            cTransactionItems() {
                const {cAccount} = this;
                const txList = (cAccount ? cAccount.txList : null);

                if (txList) {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.dRecordsCount = formatHexToInt(txList.totalCount);
                }

                return {
                    action: (this.appendItems ? 'append' : 'replace'),
                    hasNext: (txList ? txList.pageInfo.hasNext : false),
                    data: (txList ? txList.edges : [])
                };
            },

            cLoading() {
                return this.$apollo.queries.account.loading;
            }
        },

        created() {
            /** If `true`, transaction items will be appended. */
            this.appendItems = false;
        },

        methods: {
            onFetchMore() {
                const {cAccount} = this;
                const txList = (cAccount ? cAccount.txList : null)

                if (txList && txList.pageInfo && txList.pageInfo.hasNext) {
                    const cursor = txList.pageInfo.last;

                    this.$apollo.queries.account.fetchMore({
                        variables: {
                            address: this.id,
                            count: this.itemsPerPage,
                            cursor
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                            this.appendItems = true;

                            return fetchMoreResult;
                        }
                    });
                }
            },

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

        .address-transactions {
            margin-top: 32px;
        }
    }
</style>
