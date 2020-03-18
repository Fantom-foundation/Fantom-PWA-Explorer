<template>
    <div class="validator-list-dt">
        <template v-if="!dValidatorListError">
            <f-data-table
                :columns="dColumns"
                :items="dItems"
                :mobile-view="cMobileView"
                :loading="cLoading"
                first-m-v-column-width="6"
                fixed-header
            >
                <template v-slot:column-stakerAddress="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-6 f-row-label">{{ column.label }}:</div>
                        <div class="col break-word">
                            <div v-if="item.isOffline" class="offline">{{ $t('view_validator_list.offline') }}</div>
                            <router-link :to="{name: 'validator-detail', params: {address: value}}" :title="value">{{ value | formatHash }}</router-link>
                        </div>
                    </div>
                    <template v-else>
                        <div v-if="item.isOffline" class="offline">{{ $t('view_validator_list.offline') }}</div>
                        <router-link :to="{name: 'validator-detail', params: {address: value}}" :title="value">{{ value | formatHash }}</router-link>
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
            stakers: {
                query: gql`
                    query Stakers {
                        stakers {
                            id
                            stakerAddress
                            isOffline
                            isCheater
                            createdTime
                            stake
                            totalStake
                            delegatedMe
                        }
                    }
                `,
                result(_data, _key) {
                    const totals = {
                        selfStaked: 0,
                        totalDelegated: 0,
                        totalStaked: 0
                    };
                    let data;

                    if (_key === 'stakers') {
                        data = _data.data.stakers;

                        data.forEach(_item => {
                            // _item.total_staked = WEIToFTM(_item.stake) + WEIToFTM(_item.delegatedMe);

                            totals.selfStaked += parseFloat(numToFixed(WEIToFTM(_item.stake), 2));
                            totals.totalDelegated += parseFloat(numToFixed(WEIToFTM(_item.delegatedMe), 2));
                            totals.totalStaked += parseFloat(numToFixed(WEIToFTM(_item.totalStake), 2));
                        });

                        this.dItems = data;

                        this.$emit('records-count', this.dItems.length);
                        this.$emit('validator-list-totals', totals);
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
                        name: 'id',
                        label: this.$t('view_validator_list.id'),
                        formatter: formatHexToInt,
                        width: '60px'
                    },
                    {
                        name: 'stakerAddress',
                        label: this.$t('view_validator_list.name'),
                        width: '200px',
                    },
/*
                    {
                        name: 'isOffline',
                        // hidden: true,
                        formatter: formatHexToInt
                    },
*/
                    {
                        name: 'createdTime',
                        label: this.$t('view_validator_list.created_on'),
                        formatter: _value => formatDate(timestampToDate(formatHexToInt(_value) / 1000000000))
                    },
                    {
                        name: 'stake',
                        label: this.$t('view_validator_list.self_staked'),
                        css: {textAlign: 'right'},
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2)
                    },
                    {
                        name: 'delegatedMe',
                        label: this.$t('view_validator_list.delegated'),
                        css: {textAlign: 'right'},
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2)
                    },
                    // computed
                    {
                        name: 'totalStake',
                        label: this.$t('view_validator_list.total_staked'),
                        css: {textAlign: 'right'},
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2)
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

    .validator-list-dt {
        .offline {
            color: $error-color;
            font-weight: bold;
        }
    }
</style>
