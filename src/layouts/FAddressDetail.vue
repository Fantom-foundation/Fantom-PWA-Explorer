<template>
    <div class="f-address-detail">
        <template v-if="!dAccountByAddressError">
            <f-card>
                <h2 class="break-word">{{ id }}</h2>
                <div class="row">
                    <div class="col">
                        <div class="num-block">
                            <h2 class="h3">{{ $t('view_address_detail.value_in_ftm') }}</h2>
                            <div class="num"><span v-show="cAccount">{{ toFTM(cAccount ? cAccount.totalValue : 1) }}</span></div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="num-block">
                            <h2 class="h3">{{ $t('view_address_detail.value_in_usd') }}</h2>
                            <div class="num"><span v-show="cAccount">{{ toUSD(cAccount ? cAccount.totalValue : 1) }}</span></div>
                        </div>
                    </div>
                </div>
            </f-card>

            <div class="f-subsection">
                <h2>{{ $t('view_address_detail.assets') }} <span v-if="cAssetItems.length" class="f-records-count">({{ cAssetItems.length }})</span></h2>

                <f-data-table
                    :columns="dAssetColumns"
                    :items="cAssetItems"
                    fixed-header
                >
                </f-data-table>
            </div>

            <div class="f-subsection">
                <h2>{{ $t('view_block_detail.block_transactions') }} <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h2>

                <f-transaction-list
                    :items="cTransactionItems"
                    :loading="cLoading"
                    @fetch-more="onFetchMore"
                ></f-transaction-list>
            </div>
        </template>
        <template v-else>
            <div class="query-error">{{ dAccountByAddressError }}</div>
        </template>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM, FTMToUSD } from "../utils/transactions.js";
    import FTransactionList from "../data-tables/FTransactionList.vue";
    import {formatHexToInt, numToFixed, formatNumberByLocale} from "../filters.js";
    import FDataTable from "../components/FDataTable.vue";

    export default {
        components: {
            FDataTable,
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

            /** Number of items per page. */
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
                            totalValue
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
                            staker {
                                id
                                createdTime
                                isActive
                            }
                            delegation {
                                toStakerId
                                createdTime
                                amount
                                claimedReward
                                pendingRewards {
                                    amount
                                    fromEpoch
                                    toEpoch
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
                dAccountByAddressError: '',
                dAssetColumns: [
                    {
                        name: 'asset',
                        label: this.$t('view_address_detail.asset')
                    },
                    {
                        name: 'balance',
                        label: this.$t('view_address_detail.balance'),
                        css: {textAlign: 'right'}
                    },
                    {
                        name: 'valueInFTM',
                        label: this.$t('view_address_detail.value_in_ftm'),
                        css: {textAlign: 'right'}
                    },
                    {
                        name: 'valueInUSD',
                        label: this.$t('view_address_detail.value_in_usd'),
                        css: {textAlign: 'right'}
                    }
                ]
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

            /**
             * Get items for assets data table.
             */
            cAssetItems() {
                const {cAccount} = this;
                const items = [];

                if (cAccount) {
                    items.push(this.getAssetItem(this.$t('view_address_detail.available'), cAccount.balance));

                    const {delegation} = cAccount;

                    if (delegation) {
                        items.push(this.getAssetItem(this.$t('view_address_detail.delegated'), delegation.amount));
                        items.push(this.getAssetItem(this.$t('view_address_detail.pending_rewards'), delegation.pendingRewards.amount));
                        items.push(this.getAssetItem(this.$t('view_address_detail.claimed_rewards'), delegation.claimedReward));
                    } else {
                        items.push(this.getAssetItem(this.$t('view_address_detail.delegated'), 0));
                        items.push(this.getAssetItem(this.$t('view_address_detail.pending_rewards'), 0));
                        items.push(this.getAssetItem(this.$t('view_address_detail.claimed_rewards'), 0));
                    }
                }

                return items;
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
            /**
             * Get one item for asset data table.
             *
             * @param {string} _assetName
             * @param {string|number} _value
             */
            getAssetItem(_assetName, _value) {
                return {
                    asset: _assetName,
                    balance: this.toFTM(_value),
                    valueInFTM: this.toFTM(_value),
                    valueInUSD: this.toUSD(_value)
                }
            },

            /**
             * Convert value to FTM.
             *
             * @param {string|number} _value
             * @return {string}
             */
            toFTM(_value) {
                return formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2);
            },

            /**
             * Convert value to USD.
             *
             * @param {string|number} _value
             * @return {string}
             */
            toUSD(_value) {
                return formatNumberByLocale(numToFixed(FTMToUSD(WEIToFTM(_value)), 2), 2);
            },

            onFetchMore() {
                const {cAccount} = this;
                const txList = (cAccount ? cAccount.txList : null);

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

        > .f-card {
        }
    }
</style>
