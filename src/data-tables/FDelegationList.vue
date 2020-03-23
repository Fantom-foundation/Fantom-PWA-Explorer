<template>
    <div class="delegation-list-dt">
        <f-data-table
            :columns="dColumns"
            :items="items"
            :loading="loading"
            first-m-v-column-width="5"
            infinite-scroll
            fixed-header
            @fetch-more="fetchMore"
        >
            <template v-slot:column-address="{ value, item, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-5 f-row-label">{{ column.label }}</div>
                    <div class="col break-word">
                        <router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                    </div>
                </div>
                <template v-else>
                    <router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value | formatHash }}</router-link>
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
    import FDataTable from "../components/FDataTable.vue";
    // import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import {formatHexToInt, timestampToDate, formatNumberByLocale, numToFixed, formatDate} from "../filters.js";

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
            },

            /** Display loading message. */
            loading: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                dItems: [],
                dHasNext: false,
                dOutsideData: !!this.items.action,
                dTransactionListError: '',
                dColumns: [
                    {
                        name: 'address',
                        label: this.$t('delegation_list_dt.address'),
                    },
                    {
                        name: 'createdTime',
                        label: this.$t('delegation_list_dt.created_on'),
                        formatter: _value => formatDate(timestampToDate(formatHexToInt(_value) / 1000000000), true)
                    },
                    {
                        name: 'createdEpoch',
                        label: this.$t('delegation_list_dt.created_epoch'),
                        formatter: formatHexToInt
                    },
                    {
                        name: 'amount',
                        label: this.$t('delegation_list_dt.amount'),
                        formatter: _value => formatNumberByLocale(numToFixed(WEIToFTM(_value), 0), 0),
                        css: {textAlign: 'right'}
                    }
                ]
            }
        },

        computed: {
            /**
             * Property is set to `true`, if 'tdelegation-list-dt-mobile-view' breakpoint is reached.
             *
             * @return {Boolean}
             */
            cMobileView() {
                const dataTableBreakpoint = this.$store.state.breakpoints['delegation-list-dt-mobile-view'];

                return (dataTableBreakpoint && dataTableBreakpoint.matches);
            }
        },

        created() {
            /** If `true`, transaction items will be appended. */
            this.appendItems = false;
        },

        methods: {
            WEIToFTM,
            timestampToDate,
            formatHexToInt,
            formatNumberByLocale,
            numToFixed,
            formatDate
        }
    }
</script>
