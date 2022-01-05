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
                class="f-data-table-body-bg-color"
            >
                <template v-slot:column-logo="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-6 f-row-label">{{ column.label }}</div>
                        <div class="col break-word">
                            <div class="validator-img">
                                <img v-if="value"  :src="value" :alt="item.stakerInfo.name" class="not-fluid">
                                <img v-else src="/img/fantom-logo.png" alt="fantom logo" class="not-fluid">
                            </div>
                        </div>
                    </div>
                    <template v-else>
                        <div class="validator-img">
                            <img v-if="value"  :src="value" :alt="item.stakerInfo.name" class="not-fluid">
                            <img v-else src="/img/fantom-logo.png" alt="fantom logo" class="not-fluid">
                        </div>
                    </template>
                </template>

                <template v-slot:column-name="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-6 f-row-label">{{ column.label }}</div>
                        <div class="col break-word">
                            {{ value }}
                            <a v-if="(item.stakerInfo ? item.stakerInfo.website || item.stakerInfo.contact : '')" :href="(item.stakerInfo ? item.stakerInfo.website || item.stakerInfo.contact : '')" target="_blank" rel="nofollow" class="validator-website">
                                <icon data="@/assets/svg/external-link-alt.svg"></icon>
                            </a>
                        </div>
                    </div>
                    <template v-else>
                        {{ value }}
                        <a v-if="(item.stakerInfo ? item.stakerInfo.website || item.stakerInfo.contact : '')" :href="(item.stakerInfo ? item.stakerInfo.website || item.stakerInfo.contact : '')" target="_blank" rel="nofollow" class="validator-website">
                            <icon data="@/assets/svg/external-link-alt.svg"></icon>
                        </a>
                    </template>
                </template>


                <template v-slot:column-stakerAddress="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-6 f-row-label">{{ column.label }}</div>
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

<!--
                <template v-slot:column-link="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-6 f-row-label">{{ column.label }}</div>
                        <div class="col break-word">
                            <a v-if="value" :href="value" target="_blank" rel="nofollow">
                                <icon data="@/assets/svg/external-link-alt.svg" width="20" height="20"></icon>
                            </a>
                            <template v-else>-</template>
                        </div>
                    </div>
                    <template v-else>
                        <a v-if="value || (item.stakerInfo && item.stakerInfo.contact)" :href="value || (item.stakerInfo && item.stakerInfo.contact)" target="_blank" rel="nofollow">
                            <icon data="@/assets/svg/external-link-alt.svg"></icon>
                        </a>
                        <template v-else>-</template>
                    </template>
                </template>
-->
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ dValidatorListError }}</div>
        </template>
    </div>
</template>

<script>
    import FDataTable from "../components/core/FDataTable/FDataTable.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import {formatHexToInt, timestampToDate, numToFixed, formatNumberByLocale, clampDowntime} from "../filters.js";
    import {sortByHex, sortByLocaleString, sortByString} from "../utils/array-sorting.js";
    import {cloneObject} from "@/utils";

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
                type: Array,
                default() {
                    return [];
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
                            downtime
                            stakerInfo {
                                name
                                website
                                contact
                                logoUrl
                            }
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
                    const offline = [];
                    const flagged = [];
                    const remove = [];
                    const tUnknown = this.$t('view_validator_list.unknown');

                    if (_key === 'stakers') {
                        data = [..._data.data.stakers];

                        data.forEach((_item, _idx) => {
                            // _item.total_staked = WEIToFTM(_item.stake) + WEIToFTM(_item.delegatedMe);
                            totals.selfStaked += parseFloat(numToFixed(WEIToFTM(_item.stake), 0));
                            totals.totalDelegated += parseFloat(numToFixed(WEIToFTM(_item.delegatedMe), 0));
                            totals.totalStaked += parseFloat(numToFixed(WEIToFTM(_item.totalStake), 0));

                            if (!_item.stakerInfo) {
                                _item.stakerInfo = {};
                            }

                            if (!_item.stakerInfo.name) {
                                _item.stakerInfo.name = tUnknown;
                            }

                            if (_item.isOffline && !_item.isCheater) {
                                offline.push(_idx);
                            }

                            if (_item.isCheater) {
                                flagged.push(_idx);
                            }
                        });

                        if (offline.length > 0) {
                            offline.forEach((_idx, _index) => {
                                remove.push(_idx);
                                offline[_index] = cloneObject(data[_idx]);
                            });

                            this.$emit('validator-list-offline', offline);
                        }

                        if (flagged.length > 0) {
                            flagged.forEach((_idx, _index) => {
                                remove.push(_idx);
                                flagged[_index] = cloneObject(data[_idx]);
                            });

                            this.$emit('validator-list-flagged', flagged);
                        }

                        if (remove.length > 0) {
                            remove.sort(this.sortDesc)
                            remove.forEach((_idx) => {
                                data.splice(_idx, 1);
                            })

                        }

                        this.dItems = data;

                        this.$emit('records-count', this.dItems.length);
                        this.$emit('validator-list-totals', totals);
                    }
                },
                skip() {
                    return (this.items.length > 0);
                },
                error(_error) {
                    this.dValidatorListError = _error.message;
                }
            }
        },

        created() {
            if (this.items.length > 0) {
                this.dItems = this.items;
            }
        },

        data() {
            return {
                dItems: [],
                dValidatorListError: '',
                dColumns: [
                    {
                        name: 'logo',
                        label: this.$t('view_validator_list.logo'),
                        itemProp: 'stakerInfo.logoUrl',
                        cssClass: 'align-center',
                        width: '80px'
                    },
                    {
                        name: 'name',
                        label: this.$t('view_validator_list.name'),
                        itemProp: 'stakerInfo.name',
                        sortFunc: sortByLocaleString,
                        width: '200px',
                    },
                    {
                        name: 'id',
                        label: this.$t('view_validator_list.id'),
                        formatter: formatHexToInt,
                        sortFunc: sortByHex,
                        width: '80px'
                    },
                    {
                        name: 'stakerAddress',
                        label: this.$t('view_validator_list.address'),
                        sortFunc: sortByString,
                        width: '200px',
                    },
                    {
                        name: 'downtime',
                        label: this.$t('view_validator_list.downtime'),
                        formatter: _value => `${clampDowntime((Math.round(formatHexToInt(_value) / 10000000) / 100))} s`,
                        sortFunc: sortByHex,
                        width: '140px',
                    },
                    {
                        name: 'stake',
                        label: this.$t('view_validator_list.self_staked'),
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 0), 0),
                        sortFunc: sortByHex,
                        cssClass: 'align-end',
                    },
                    {
                        name: 'delegatedMe',
                        label: this.$t('view_validator_list.delegated'),
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 0), 0),
                        sortFunc: sortByHex,
                        cssClass: 'align-end',
                    },
                    // computed
                    {
                        name: 'totalStake',
                        label: this.$t('view_validator_list.total_staked'),
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 0), 0),
                        sortFunc: sortByHex,
                        sortDir: 'desc',
                        cssClass: 'align-end',
                    },
/*
                    {
                        name: 'link',
                        label: this.$t('view_validator_list.link'),
                        itemProp: 'stakerInfo.website',
                        css: {textAlign: 'center'},
                        width: '50px'
                    }
*/
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
            sortDesc(a, b) {
                return b - a;
            },

            WEIToFTM,
            timestampToDate,
            numToFixed,
            clampDowntime,
        }
    }
</script>

<style lang="scss">
    .validator-list-dt {
        .offline {
            color: $error-color;
            font-weight: bold;
        }
    }
</style>
