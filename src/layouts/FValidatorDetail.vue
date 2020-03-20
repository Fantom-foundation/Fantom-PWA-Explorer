<template>
    <div class="f-validator-detail f-data-layout">
        <template v-if="!dStakerByAddressError">
            <f-card>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.validator_id') }}</div>
                    <div class="col">
                        <div v-show="'id' in cStaker">
                            {{ cStaker.id | formatHexToInt }}
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.name') }}</div>
                    <div class="col">
                        <div v-show="cStakerName">
                            <a v-if="cStakerWebsite" :href="cStakerWebsite" target="_blank" rel="nofollow" class="validator-website">
                                {{ cStakerName }} <icon data="@/assets/svg/external-link-alt.svg" width="12" height="12"></icon>
                            </a>
                            <template v-else>
                                {{ cStakerName }}
                            </template>
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.address') }}</div>
                    <div class="col"><div class="break-word">{{ address }}</div></div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.start_epoch') }}</div>
                    <div class="col">
                        <div v-show="'createdEpoch' in cStaker">
                            {{ cStaker.createdEpoch | formatHexToInt }}
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.start_time') }}</div>
                    <div class="col">
                        <div v-show="'createdTime' in cStaker">
                            {{ timestampToDate(formatHexToInt(cStaker.createdTime) / 1000000000) }}
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.validating_power') }}</div>
                    <div class="col">
                        <div v-show="'validationScore' in cStaker">
                            {{ formatNumberByLocale(numToFixed(formatHexToInt(cStaker.validationScore) / 10000000, 0)) }}
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.amount_staked') }}</div>
                    <div class="col">
                        <div v-show="'stake' in cStaker">
                            {{ formatNumberByLocale(numToFixed(WEIToFTM(cStaker.stake), 0)) }} FTM
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.amount_delegated') }}</div>
                    <div class="col">
                        <div v-show="'delegatedMe' in cStaker">
                            {{ formatNumberByLocale(numToFixed(WEIToFTM(cStaker.delegatedMe), 0)) }} FTM <br>
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.staking_total') }}</div>
                    <div class="col">
                        <div v-show="'totalStake' in cStaker">
                            {{ formatNumberByLocale(numToFixed(WEIToFTM(cStaker.totalStake), 0)) }} FTM <br>
                        </div>
                    </div>
                </div>
            </f-card>

            <div class="f-subsection">
                <h2>{{ $t('view_validator_detail.delegations') }} <span v-if="cDelegationItems.length" class="f-records-count">({{ cDelegationItems.length }})</span></h2>

                <f-delegation-list
                    :items="cDelegationItems"
                    :loading="cLoading"
                ></f-delegation-list>
            </div>
        </template>
        <template v-else>
            <div class="query-error">{{ dStakerByAddressError }}</div>
        </template>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import gql from 'graphql-tag';
    import {formatHexToInt, timestampToDate, formatNumberByLocale, numToFixed} from "../filters.js";
    import { WEIToFTM } from "../utils/transactions.js";
    import FDelegationList from "../data-tables/FDelegationList.vue";

    export default {
        components: {
            FDelegationList,
            FCard
        },

        props: {
            /** Validator (staker) address. */
            address: {
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
            staker: {
                query: gql`
                    query StakerByAddress($address: Address!) {
                        staker(address: $address) {
                            id
                            stakerAddress
                            totalStake
                            stake
                            delegatedMe
                            createdEpoch
                            createdTime
                            validationScore
                            stakerInfo {
                                name
                                website
                                contact
                                logoUrl
                            }
                            delegations {
                                address
                                amount
                                createdEpoch
                                createdTime
                            }
                        }
                    }
                `,
                variables() {
                    return {
                        address: this.address
                    }
                },
                error(_error) {
                    this.dStakerByAddressError = _error.message;
                }
            }
        },

        data() {
            return {
                dRecordsCount: 0,
                dStakerByAddressError: ''
            }
        },

        computed: {
            cStaker() {
                return this.staker || {};
            },

            cStakerName() {
                const {staker} = this;

                return staker && staker.stakerInfo && staker.stakerInfo.name ? staker.stakerInfo.name : '';
            },

            cStakerWebsite() {
                const {staker} = this;

                return staker && staker.stakerInfo && staker.stakerInfo.website ? staker.stakerInfo.website : '';
            },

            cDelegationItems() {
                const {cStaker} = this;
                let items = [];

                if (cStaker && cStaker.delegations) {
                    items = cStaker.delegations
                }

                return items;
            },

            cLoading() {
                return this.$apollo.queries.staker.loading;
            }
        },

        methods: {
            WEIToFTM,
            timestampToDate,
            formatHexToInt,
            formatNumberByLocale,
            numToFixed
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-validator-detail {
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
