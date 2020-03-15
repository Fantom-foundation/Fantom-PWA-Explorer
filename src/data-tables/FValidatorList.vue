<template>
    <div class="validator-list-dt">
        <template v-if="!dValidatorListError">
            <f-data-table
                :columns="dColumns"
                :items="dItems"
                :mobile-view="cMobileView"
                :loading="cLoading"
                fixed-header
            >
                <template v-slot:column-StakerAddress="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}:</div>
                        <div class="col break-word">
                            <div v-if="item.Status === '0x1'" class="offline">{{ $t('view_validator_list.offline') }}</div>
                            {{ value | formatHash }}
                        </div>
                    </div>
                    <template v-else>
                        <div v-if="item.Status === '0x1'" class="offline">{{ $t('view_validator_list.offline') }}</div>
                        {{ value | formatHash }}
                    </template>
                </template>
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ dValidatorListError }}</div>
        </template>
    </div>
</template>

<script>
    import FDataTable from "../components/FDataTable.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import {formatHexToInt, timestampToDate, numToFixed, formatDate, formatNumberByLocale} from "../filters.js";

    export default {
        components: {
            FDataTable
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
            epoch: {
                query: gql`
                    query Epoch {
                        epoch(id:"0x4") {
                            Id
                            EndTime
                            Duration
                            EpochFee
                            TotalBaseRewardWeight
                            TotalTxRewardWeight
                            BaseRewardPerSecond
                            StakeTotalAmount
                            DelegationsTotalAmount
                            TotalSupply
                        }
                    }
                `
            },
            stakers: {
                query: gql`
                    query Stakers {
                        stakers {
                            Id
                            StakerAddress
                            Status
                            CreatedTime
                            StakeAmount
                            DelegatedMe
                        }
                    }
                `,
                result(_data, _key) {
                    let data;

                    if (_key === 'stakers') {
                        data = _data.data.stakers;

                        data.forEach(_item => {
                            _item.total_staked = WEIToFTM(_item.StakeAmount) + WEIToFTM(_item.DelegatedMe);
                        });

                        this.dItems = data;

                        this.$emit('records-count', this.dItems.length);
                    }
                },
                error(_error) {
                    this.dValidatorListError = _error.message;
                }
            }
        },

        data() {
            return {
                dItems: [],
                dValidatorListError: '',
                dColumns: [
                    {
                        name: 'Id',
                        label: this.$t('view_validator_list.id'),
                        formatter: formatHexToInt,
                        width: '60px'
                    },
                    {
                        name: 'StakerAddress',
                        label: this.$t('view_validator_list.name'),
                        width: '200px',
                    },
/*
                    {
                        name: 'Status',
                        // hidden: true,
                        formatter: formatHexToInt
                    },
*/
                    {
                        name: 'CreatedTime',
                        label: this.$t('view_validator_list.created_time'),
                        formatter: _value => formatDate(timestampToDate(_value))
                    },
                    {
                        name: 'StakeAmount',
                        label: this.$t('view_validator_list.stake_amount'),
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 2))
                    },
                    {
                        name: 'DelegatedMe',
                        label: this.$t('view_validator_list.delegated'),
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 2))
                    },
                    // computed
                    {
                        name: 'total_staked',
                        label: this.$t('view_validator_list.total_staked'),
                        formatter: _value => formatNumberByLocale(numToFixed(_value, 2))
                    }
                ]
            }
        },

        computed: {
            /**
             * Property is set to `true`, if 'tvalidator-list-dt-mobile-view' breakpoint is reached.
             *
             * @return {Boolean}
             */
            cMobileView() {
                const dataTableBreakpoint = this.$store.state.breakpoints['validator-list-dt-mobile-view'];

                return (dataTableBreakpoint && dataTableBreakpoint.matches);
            },

            cLoading() {
                return this.loading || this.$apollo.queries.stakers.loading;
            }
        },

        methods: {
            WEIToFTM,
            timestampToDate,
            numToFixed
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .offline {
        color: $error-color;
        font-weight: bold;
    }
</style>
