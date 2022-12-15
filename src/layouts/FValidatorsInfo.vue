<template>
    <div class="f-validators-info">
        <template v-if="!dValidatorsInfoError">
            <div class="row f-data-layout equal-height no-vert-col-padding collapse-md">
                <div class="col margin-bottom-menu">
                    <f-card>
                        <h2>{{ $t('view_validators_info.staking_summary') }}</h2>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.total_self_staked') }}</div>
                            <div class="col">
                                <div v-show="'fSelfStaked' in dTotals">{{ dTotals.fSelfStaked }} FTM <span v-if="cSelfStaked">({{ cSelfStaked }}%)</span></div>
                            </div>
                        </div>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.total_delegated') }}</div>
                            <div class="col">
                                <div v-show="'fTotalDelegated' in dTotals">{{ dTotals.fTotalDelegated }} FTM <span v-if="cDelegated">({{ cDelegated }}%)</span></div>
                            </div>
                        </div>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.total_staked') }}</div>
                            <div class="col">
                                <div v-show="'fTotalStaked' in dTotals">{{ dTotals.fTotalStaked }} FTM <span v-if="cStaked">({{ cStaked }}%)</span></div>
                            </div>
                        </div>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.daily_rewards') }}</div>
                            <div class="col">
                                <div v-show="cDailyRewards">{{ formatNumberByLocale(numToFixed(cDailyRewards, 0)) }} FTM</div>
                            </div>
                        </div>

<!--
                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.current_reward_rate') }}</div>
                            <div class="col">
                                <div v-show="cCurrentRewardRate">{{ formatNumberByLocale(numToFixed(cCurrentRewardRate, 0)) }}%</div>
                            </div>
                        </div>
-->
                    </f-card>
                </div>
                <div class="col">
                    <f-card>
                        <h2>{{ $t('view_validators_info.last_epoch') }}</h2>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.epoch_number') }}</div>
                            <div class="col">
                                <div v-show="'id' in cEpoch">{{ cEpoch.id | formatHexToInt }}</div>
                            </div>
                        </div>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.end_time') }}</div>
                            <div class="col">
                                <div v-show="'endTime' in cEpoch">
                                    <timeago :datetime="timestampToDate(cEpoch.endTime)" :auto-update="1" :converter-options="{addSuffix: true}"></timeago>
                                </div>
                            </div>
                        </div>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.duration') }}</div>
                            <div class="col">
                                <div v-show="'duration' in cEpoch && cEpoch.duration">
                                    {{ formatHexToInt(cEpoch.duration) | formatDuration }}
                                </div>
                            </div>
                        </div>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.fee') }}</div>
                            <div class="col">
                                <div v-show="'epochFee' in cEpoch">{{  WEIToFTM(cEpoch.epochFee) }} FTM</div>
                            </div>
                        </div>

                        <div class="row no-collapse">
                            <div class="col-5 f-row-label">{{ $t('view_validators_info.total_supply') }}</div>
                            <div class="col">
                                <div v-show="dTotalSupply">{{ formatNumberByLocale(numToFixed(dTotalSupply, 0)) }} FTM</div>
                            </div>
                        </div>
                    </f-card>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="query-error">{{ dValidatorsInfoError }}</div>
        </template>

        <div v-if="showRewardsEstimation" class="f-subsection">
            <h2 class="h1">{{ $t('view_validators_info.estimate_your_rewards') }}</h2>
            <div class="row f-data-layout equal-height no-vert-col-padding collapse-md">
                <div class="col-6">
                    <f-card><RewardsEstimation /></f-card>
                </div>
            </div>
        </div>

        <div class="f-subsection">
            <h2 class="h1">{{ $t('view_validator_list.validators') }} <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h2>

            <f-validator-list
                code="validators"
                @records-count="onRecordsCount"
                @validator-list-totals="onValidatorListTotals"
                @validator-list-offline="onValidatorListOffline"
                @validator-list-flagged="onValidatorListFlagged"
                @validator-list-inactive="onValidatorListInactive"
            >
            </f-validator-list>
        </div>

        <div class="f-subsection" v-if="dInactiveItems.length">
            <h2 class="h1">{{ $t('view_validator_list.inactive') }} <span class="f-records-count">({{ dInactiveItems.length }})</span></h2>

            <f-validator-list :items="dInactiveItems" code="inactive-validators" />
        </div>

        <div class="f-subsection" v-if="dOfflineItems.length">
            <h2 class="h1">{{ $t('view_validator_list.offline') }} <span class="f-records-count">({{ dOfflineItems.length }})</span></h2>

            <f-validator-list :items="dOfflineItems" code="offline-validators" />
        </div>

        <div class="f-subsection" v-if="dFlaggedItems.length">
            <h2 class="h1">{{ $t('view_validator_list.flagged') }} <span class="f-records-count">({{ dFlaggedItems.length }})</span></h2>

            <f-validator-list :items="dFlaggedItems" code="flagged-validators" />
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import FCard from "../components/core/FCard/FCard.vue";
    import FValidatorList from "../data-tables/FValidatorList.vue";
    import {formatHexToInt, formatNumberByLocale, numToFixed, timestampToDate} from "../filters.js";
    import web3utils from 'web3-utils';
    import RewardsEstimation from "@/components/RewardsEstimation.vue";
    import appConfig from '../../app.config.js';

    export default {
        components: {
            RewardsEstimation,
            FValidatorList,
            FCard
        },

        props: {
            /**
             * Data and action.
             * Actions:
             * '' - replace items
             * 'append' - append new items
             */
            items: {
                type: Object,
                default() {
                    return {
                        action: '',
                        data: []
                    };
                }
            }
        },

        apollo: {
            currentEpoch: {
                query: gql`
                    query Epoch {
                        currentEpoch
                    }
                `,
                result(_data) {
                    this.$apollo.queries.epoch.refetch({
                        id: web3utils.numberToHex(formatHexToInt(_data.data.currentEpoch) - 1)
                    });
                    this.$apollo.queries.epoch.skip = false;
                },
                error(_error) {
                    this.dValidatorsInfoError = _error.message;
                }
            },
            epoch: {
                query: gql`
                    query LastEpoch($id: Long!) {
                        epoch(id: $id) {
                            id
                            endTime
                            duration
                            epochFee
                            totalSupply
                            baseRewardPerSecond
                        }
                    }
                `,
                skip() {
                    return true;
                },
                variables() {
                    return {
                        id: ''
                    }
                },
                result(_data) {
                    this.dTotalSupply = WEIToFTM(_data.data.epoch.totalSupply);
                },
                error(_error) {
                    this.dValidatorsInfoError = _error.message;
                }
            }
        },

        data() {
            return {
                dItems: [],
                dOfflineItems: [],
                dFlaggedItems: [],
                dInactiveItems: [],
                dValidatorsInfoError: '',
                dTotals: {},
                dTotalSupply: 0,
                dRecordsCount: 0,
                showRewardsEstimation: appConfig.flags.rewardsEstimation,
            }
        },

        computed: {
            cEpoch() {
                return this.epoch || {};
            },

            cSelfStaked() {
                if (this.dTotals.selfStaked && this.dTotalSupply) {
                    return numToFixed((this.dTotals.selfStaked / this.dTotalSupply) * 100, 0);
                }

                return 0;
            },

            cDelegated() {
                if (this.dTotals.totalDelegated && this.dTotalSupply) {
                    return numToFixed((this.dTotals.totalDelegated / this.dTotalSupply) * 100, 0);
                }

                return 0;
            },

            cStaked() {
                if (this.dTotals.totalStaked && this.dTotalSupply) {
                    return numToFixed((this.dTotals.totalStaked / this.dTotalSupply) * 100, 0);
                }

                return 0;
            },

            cDailyRewards() {
                const {epoch} = this;

                if (epoch && epoch.baseRewardPerSecond) {
                    return WEIToFTM(epoch.baseRewardPerSecond) * 86400;
                }

                return 0;
            },

            cCurrentRewardRate() {
                const {cDailyRewards} = this;
                const {dTotals} = this;
                let rate = 0;

                if (cDailyRewards && dTotals && dTotals.totalStaked) {
                    return ((cDailyRewards * 365) / dTotals.totalStaked) * 100;
                }

                return rate;
            }
        },

        methods: {
            /**
             * @param {int} _num
             */
            onRecordsCount(_num) {
                this.dRecordsCount = _num;
            },

            onValidatorListTotals(_totals) {
                this.dTotals = {
                    ..._totals,
                    fSelfStaked: formatNumberByLocale(numToFixed(_totals.selfStaked, 2)),
                    fTotalDelegated: formatNumberByLocale(numToFixed(_totals.totalDelegated, 2)),
                    fTotalStaked: formatNumberByLocale(numToFixed(_totals.totalStaked, 2))
                };
            },

            onValidatorListOffline(_offline) {
                this.dOfflineItems = _offline;
            },

            onValidatorListFlagged(_flagged) {
                this.dFlaggedItems = _flagged;
            },

            onValidatorListInactive(_inactive) {
                this.dInactiveItems = _inactive;
            },

            WEIToFTM,
            timestampToDate,
            formatHexToInt,
            formatNumberByLocale,
            numToFixed
        }
    }
</script>
