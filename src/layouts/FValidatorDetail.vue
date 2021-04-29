<template>
    <div class="f-validator-detail f-data-layout">
        <template v-if="!dStakerByAddressError">
            <f-card>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label center-v">{{ $t('view_validator_detail.name') }}</div>
                    <div class="col">
                        <div v-show="cStakerName">
                            <div class="validator-img">
                                <img v-if="cStakerLogoUrl"  :src="cStakerLogoUrl" :alt="cStakerName" class="not-fluid">
                                <img v-else src="/img/fantom-logo.png" alt="fantom logo" class="not-fluid">
                            </div>

                            {{ cStakerName }}

                            <a v-if="cStakerWebsite" :href="cStakerWebsite" target="_blank" rel="nofollow" class="validator-website">
                                <icon data="@/assets/svg/external-link-alt.svg"></icon>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.validator_id') }}</div>
                    <div class="col">
                        <div v-show="'id' in cStaker">
                            {{ cStaker.id | formatHexToInt }}
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
                            {{ formatDate(timestampToDate(formatHexToInt(cStaker.createdTime) / 1000000000)) }}
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
                            {{ formatNumberByLocale(numToFixed(WEIToFTM(cStaker.delegatedMe), 0)) }} FTM
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.staking_total') }}</div>
                    <div class="col">
                        <div v-show="'totalStake' in cStaker">
                            {{ formatNumberByLocale(numToFixed(WEIToFTM(cStaker.totalStake), 0)) }} FTM
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.active') }}</div>
                    <div class="col">
                        <div v-show="'isActive' in cStaker">
                            <f-yes-no :value="cStaker.isActive" use-colors />
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.online') }}</div>
                    <div class="col">
                        <div v-show="'isOffline' in cStaker">
                            <f-yes-no :value="!cStaker.isOffline" use-colors />
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.downtime') }}</div>
                    <div class="col">
                        <div v-show="'downtime' in cStaker">
                            {{ clampDowntime(Math.round(formatHexToInt(cStaker.downtime) / 10000000) / 100) }} s
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.locked_until') }}</div>
                    <div class="col">
                        <div v-show="'lockedUntil' in cStaker">
                            {{ formatDate(timestampToDate(cStaker.lockedUntil)) }}
                        </div>
                    </div>
                </div>

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_validator_detail.lock_days') }}</div>
                    <div class="col">
                        <div v-show="'lockedUntil' in cStaker">
                            {{ cLockDays }}
                        </div>
                    </div>
                </div>
            </f-card>

            <div class="f-subsection">
                <h2 class="h1">{{ $t('view_validator_detail.delegations') }} <span v-if="dDelegationListRecordsCount" class="f-records-count">({{ dDelegationListRecordsCount }})</span></h2>

                <f-delegation-list
                    :staker-id="cStaker.id"
                    @records-count="onDelegationListRecordsCount"
                />
            </div>
        </template>
        <template v-else>
            <div class="query-error">{{ dStakerByAddressError }}</div>
        </template>
    </div>
</template>

<script>
    import FCard from "../components/core/FCard/FCard.vue";
    import gql from 'graphql-tag';
    import {
        formatHexToInt,
        timestampToDate,
        formatNumberByLocale,
        numToFixed,
        clampDowntime,
        formatDate,
        prepareTimestamp
    } from "../filters.js";
    import { WEIToFTM } from "../utils/transactions.js";
    import FDelegationList from "../data-tables/FDelegationList.vue";
    import FYesNo from "../components/FYesNo.vue";

    const dayS = 60 * 60 * 24;

    export default {
        components: {
            FYesNo,
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
                            downtime
                            lockedUntil
                            isActive
                            isOffline
                            stakerInfo {
                                name
                                website
                                contact
                                logoUrl
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
                dDelegationListRecordsCount: 0,
                dStakerByAddressError: ''
            }
        },

        computed: {
            cStaker() {
                return this.staker || {};
            },

            cStakerName() {
                const {staker} = this;

                return staker && staker.stakerInfo && staker.stakerInfo.name ? staker.stakerInfo.name : this.$t('view_validator_list.unknown');
            },

            cStakerWebsite() {
                const {staker} = this;

                return staker && staker.stakerInfo ? staker.stakerInfo.website || staker.stakerInfo.contact : '';
            },

            cStakerLogoUrl() {
                const {staker} = this;

                return staker && staker.stakerInfo && staker.stakerInfo.logoUrl ? staker.stakerInfo.logoUrl : '';
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
            },

            cLockDays() {
                const {cStaker} = this;
                const ts = cStaker && cStaker.lockedUntil ? prepareTimestamp(cStaker.lockedUntil) : 0;

                return ts > 0 ? parseInt((ts - Date.now()) / (dayS * 1000), 10) : '-';
            }
        },

        methods: {
            onDelegationListRecordsCount(_num) {
                this.dDelegationListRecordsCount = _num;
            },

            WEIToFTM,
            timestampToDate,
            formatDate,
            formatHexToInt,
            formatNumberByLocale,
            numToFixed,
            clampDowntime,
        }
    }
</script>

<style lang="scss">
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

        .validator-img {
            margin-right: 8px;
        }
    }
</style>
