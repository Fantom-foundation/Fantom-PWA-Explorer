<template>
    <div class="f-address-detail">
        <template v-if="!dAccountByAddressError">
            <div class="row f-data-layout equal-height no-vert-col-padding collapse-md">
                <div class="col col-6-lg margin-bottom-menu">
                    <f-card>
                        <h2>{{ $t('view_address_detail.balance') }}</h2>

                        <div class="balance center-v">
                            <h3 class="h1"><span v-show="cAccount">{{ toFTM(cAccount ? cAccount.totalValue : 1) }} <span class="ftm">FTM</span></span></h3>
                            <div v-show="cAccount" class="usd">${{ toUSD(cAccount ? cAccount.totalValue : 1) }}</div>
                        </div>
                    </f-card>
                </div>
                <div class="col col-6-lg margin-bottom-menu">
                    <f-card>
                        <h2>{{ $t('view_address_detail.available') }}</h2>

                        <div class="balance center-v">
                            <h3 class="h1"><span v-show="'available' in cAssets">{{ toFTM(cAssets.available) }} <span class="ftm">FTM</span></span></h3>
                            <div v-show="'available' in cAssets" class="usd">${{ toUSD(cAssets.available) }}</div>
                        </div>
                    </f-card>
                </div>
                <div class="col">
                    <f-card>
                        <h2>{{ $t('view_address_detail.staking') }}</h2>

                        <!--
                                                <div class="row no-collapse">
                                                    <div class="col f-row-label">{{ $t('view_address_detail.available') }}</div>
                                                    <div class="col">
                                                        <div v-show="'available' in cAssets">{{ toFTM(cAssets.available) }} FTM</div>
                                                    </div>
                                                </div>
                        -->
                        <div class="row no-collapse">
                            <div class="col f-row-label">{{ $t('view_address_detail.delegated') }}</div>
                            <div class="col">
                                <div v-show="'delegated' in cAssets">{{ toFTM(cAssets.delegated, true) }} FTM</div>
                            </div>
                        </div>
                        <div class="row no-collapse">
                            <div class="col f-row-label">{{ $t('view_address_detail.pending_rewards') }}</div>
                            <div class="col">
                                <div v-show="'pending_rewards' in cAssets">{{ toFTM(cAssets.pending_rewards, true) }} FTM</div>
                            </div>
                        </div>
                        <div class="row no-collapse">
                            <div class="col f-row-label">{{ $t('view_address_detail.stashed_rewards') }}</div>
                            <div class="col">
                                <div v-show="'stashed' in cAssets">{{ toFTM(cAssets.stashed) }} FTM</div>
                            </div>
                        </div>
                        <div class="row no-collapse">
                            <div class="col f-row-label">{{ $t('view_address_detail.claimed_rewards') }}</div>
                            <div class="col">
                                <div v-show="'claimed_rewards' in cAssets">
                                    -
                                    <!--{{ toFTM(cAssets.claimed_rewards, true) }} FTM-->
                                </div>
                            </div>
                        </div>
                        <div class="row no-collapse">
                            <div class="col f-row-label">{{ $t('validators') }}</div>
                            <div class="col">
                                <template v-if="validators && validators.length">
                                    <div v-for="validator in validators" :key="validator.id">
                                        <router-link v-if="validator.stakerAddress" :to="{ name: 'validator-detail', params: {address: validator.stakerAddress} }">
                                            {{ validator ? validator.name : '' }}
                                        </router-link>
                                        <span v-else>{{ validator ? validator.name : '' }}</span>
                                    </div>
                                </template>
                                <template v-else>-</template>
                            </div>
                        </div>
                    </f-card>
                </div>
            </div>

            <!--
                        <br><br>
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
            -->

            <!--
                        <div class="f-subsection">
                            <h2 class="h1">{{ $t('view_address_detail.assets') }} <span v-if="cAssetItems.length" class="f-records-count">({{ cAssetItems.length }})</span></h2>

                            <f-data-table
                                :columns="dAssetColumns"
                                :items="cAssetItems"
                                fixed-header
                            >
                            </f-data-table>
                        </div>
            -->

            <div class="f-subsection">
                <f-tabs>
                    <template #transactions>
                        <h2>
                            {{ $t('view_address_detail.transactions') }}
                            <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span>
                        </h2>
                    </template>
                    <template #assets>
                        <h2>
                            {{ $t('view_address_detail.assets') }}
                            <span class="f-records-count">({{ assetsRecordsCount }})</span>
                        </h2>
                    </template>
                    <template #delegations>
                        <h2>
                            {{ $t('view_address_detail.delegations') }}
                            <span class="f-records-count">({{ delegationsRecordsCount }})</span>
                        </h2>
                    </template>

                    <f-tab title-slot="transactions">
                        <f-transaction-list
                            :items="cTransactionItems"
                            :loading="cLoading"
                            :address-col="id"
                            @fetch-more="onFetchMore"
                        ></f-transaction-list>
                    </f-tab>
                    <f-tab title-slot="assets">
                        <address-asset-list :tokens="tokens" :f-mint-account="fMintAccount" @records-count="onAssetsRecordsCount" />
                    </f-tab>
                    <f-tab title-slot="delegations">
                        <address-delegation-list v-if="this.loadDelegations" :account-address="id" @records-count="onDelegationsRecordsCount" />
                    </f-tab>
                </f-tabs>

<!--                <h2 class="h1">{{ $t('view_block_detail.block_transactions') }} <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h2>-->

            </div>
        </template>
        <template v-else>
            <div class="query-error">{{ dAccountByAddressError }}</div>
        </template>
    </div>
</template>

<script>
    import FCard from "../components/core/FCard/FCard.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM, FTMToUSD } from "../utils/transactions.js";
    import FTransactionList from "../data-tables/FTransactionList.vue";
    import {formatHexToInt, numToFixed, formatNumberByLocale, timestampToDate} from "../filters.js";
    import FTabs from "@/components/core/FTabs/FTabs.vue";
    import FTab from "@/components/core/FTabs/FTab.vue";
    import AddressDelegationList from "@/data-tables/AddressDelegationList.vue";
    import AddressAssetList from "@/data-tables/AddressAssetList.vue";
    // import FDataTable from "../components/core/FDataTable/FDataTable.vue";

    export default {
        components: {
            AddressAssetList,
            AddressDelegationList,
            FTab,
            FTabs,
            // FDataTable,
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
                            contract {
                                address
                                deployedBy {
                                    hash
                                    contractAddress
                                }
                                name
                                version
                                compiler
                                sourceCode
                                abi
                                validated
                                supportContact
                                timestamp
                            }
                            balance
                            totalValue
                            stashed
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
                            delegations {
                                totalCount
                                edges {
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
                                    cursor
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
            },
        },

        data() {
            return {
                /** @type {FMintAccount} */
                fMintAccount: {
                    collateral: [],
                    debt: [],
                },
                /** @type {DefiToken[]} */
                tokens: [],
                dRecordsCount: 0,
                assetsRecordsCount: 0,
                delegationsRecordsCount: 0,
                dAccountByAddressError: '',
                validators: null,
                loadDelegations: false,
/*
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
*/
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
                    this.initDeFi();
                }
            }
        },

        computed: {
            cAccount() {
                if (this.account && this.account.contract) {
                    this.$emit('is-contract');
                } else {
                    this.$emit('is-address');
                }

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

            cAssets() {
                const {cAccount} = this;
                const assets = {};
                const validatorIds = [];

                if (cAccount) {
                    const { delegations } = cAccount;

                    assets.available = cAccount.balance;
                    assets.stashed = cAccount.stashed || 0;

                    assets.delegated = 0;
                    assets.pending_rewards = 0;
                    assets.claimed_rewards = 0;

                    if (delegations && delegations.edges) {
                        delegations.edges.forEach((_edge) => {
                            const { delegation } = _edge;

                            validatorIds.push(delegation.toStakerId);

                            assets.delegated += (delegation ? WEIToFTM(delegation.amount) : 0);
                            assets.pending_rewards += (delegation && delegation.pendingRewards ? WEIToFTM(delegation.pendingRewards.amount) : 0);
                            assets.claimed_rewards += (delegation ? WEIToFTM(delegation.claimedReward) : 0);
                        });

                        this.setValidators(validatorIds);
                    }
                }

                return assets;
            },

            /**
             * Get items for assets data table.
             */
/*
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
*/

            cLoading() {
                return this.$apollo.queries.account.loading;
            },
        },

        created() {
            /** If `true`, transaction items will be appended. */
            this.appendItems = false;

            setTimeout(() => {
                this.initDeFi();
            }, 500);

            // postpone delegations loading
            setTimeout(() => {
                this.loadDelegations = true;
            }, 1400);
        },

        methods: {
            /**
             * Get one item for asset data table.
             *
             * @param {string} _assetName
             * @param {string|number} _value
             */
/*
            getAssetItem(_assetName, _value) {
                return {
                    asset: _assetName,
                    balance: this.toFTM(_value),
                    valueInFTM: this.toFTM(_value),
                    valueInUSD: this.toUSD(_value)
                }
            },
*/

            async initDeFi() {
                const { $defi } = this;
                const result = await Promise.all([
                    $defi.fetchFMintAccount(this.id),
                    $defi.fetchERC20Assets(this.id),
                    // $defi.fetchERC20Tokens(),
                    $defi.init(),
                ]);

                this.fMintAccount = result[0];
                this.tokens = result[1];

                setTimeout(async () => {
                    this.tokens = await $defi.getERC20TokensWithAvailableBalances(this.id, this.tokens);
                }, 30);
            },

            /**
             * @param {array} _validatorIds
             * @return {Promise<void>}
             */
            async setValidators(_validatorIds) {
                let data;

                if (this.validators === null) {
                    data = await this.fetchValidators();

                    this.validators = data.filter((_validator) => {
                        if (_validatorIds.indexOf(_validator.id) > -1) {
                            _validator.name = `${_validator.stakerInfo ? _validator.stakerInfo.name : this.$t('unknown')}, ${parseInt(_validator.id, 16)}`;
                            return true;
                        }

                        return false;
                    });
                }
            },

            async fetchValidators() {
                const data = await this.$apollo.query({
                    query: gql`
                        query StakerById {
                            stakers {
                                id
                                stakerAddress
                                stakerInfo {
                                    name
                                    website
                                    contact
                                    logoUrl
                                }
                            }
                        }
                    `,
                    fetchPolicy: 'network-only',
                });

                return data.data.stakers;
            },

            async getStakerById(_id) {
                const data = await this.$apollo.query({
                    query: gql`
                        query StakerById($id: Long!) {
                            staker(id: $id) {
                                id
                                stakerAddress
                                stakerInfo {
                                    name
                                    website
                                    contact
                                    logoUrl
                                }
                            }
                        }
                    `,
                    variables: {
                        id: _id,
                    },
                    fetchPolicy: 'network-only',
                });

                return data.data.staker;
            },

            /**
             * Convert value to FTM.
             *
             * @param {string|number} _value
             * @param {boolean} _isNumber Value is number.
             * @return {string}
             */
            toFTM(_value, _isNumber) {
                return formatNumberByLocale(numToFixed(_isNumber ? _value : WEIToFTM(_value), 2), 2);
            },

            /**
             * Convert value to USD.
             *
             * @param {string|number} _value
             * @return {string}
             */
            toUSD(_value) {
                return formatNumberByLocale(numToFixed(FTMToUSD(WEIToFTM(_value), this.$store.state.tokenPrice), 2), 2);
            },

            onAssetsRecordsCount(_count) {
                this.assetsRecordsCount = _count;
            },

            onDelegationsRecordsCount(_count) {
                this.delegationsRecordsCount = _count;
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
            FTMToUSD,
            timestampToDate,
        }
    }
</script>

<style lang="scss">
    .f-address-detail {
        .balance {
            height: calc(100% - 48px);
            text-align: right;

            h3 {
                text-align: right;
                margin-bottom: 0;
            }

            .usd {
                color: $light-gray-color;
                font-size: 26px;
            }
        }

        .num-block {
            h2 {
                text-align: center;
                margin-top: 16px;
                margin-bottom: 4px;
            }

            .num {
                text-align: center;
                font-weight: bold;
                font-size: $fs36;
            }
        }

        > .f-card {
        }
    }
</style>
