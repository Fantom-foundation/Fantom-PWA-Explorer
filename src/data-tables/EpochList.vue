<template>
    <div class="epochlist">
        <template v-if="!queryError">
            <f-data-table
                :columns="dColumns"
                :items="dItems"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                :mobile-view="cMobileView"
                infinite-scroll
                fixed-header
                class="f-data-table-body-bg-color"
                @fetch-more="fetchMore"
            >
                <template v-slot:column-id="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}</div>
                        <div class="col-8">
                            <router-link :to="{name: 'epoch-detail', params: {id: value}}">
                                {{ value }}
                            </router-link>
                        </div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'epoch-detail', params: {id: value}}">
                            {{ value }}
                        </router-link>
                    </template>
                </template>

                <template v-slot:column-fee="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}</div>
                        <div class="col-8 break-word">
                            <f-token-value
                                :value="value"
                                :decimals="2"
                                :use-placeholder="false"
                                no-currency
                            />
                        </div>
                    </div>
                    <template v-else>
                        <f-token-value
                            :value="value"
                            :decimals="2"
                            :use-placeholder="false"
                            no-currency
                        />
                    </template>
                </template>
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ queryError }}</div>
        </template>
    </div>
</template>

<script>
import FDataTable from "../components/core/FDataTable/FDataTable.vue";
import gql from "graphql-tag";
import { WEIToFTM } from "../utils/transactions.js";
import {timestampToDate, formatHexToInt, formatDate, formatDuration} from "../filters.js";
import {cloneObject} from "@/utils";
import FTokenValue from "@/components/core/FTokenValue/FTokenValue.vue";

export default {
    name: "EpochList",

    components: {
        FTokenValue,
        FDataTable
    },

    props: {
        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 40
        }
    },

    apollo: {
        epochs: {
            query: gql`
                query EpochList($cursor: Cursor, $count: Int!) {
                    epochs(cursor: $cursor, count: $count) {
                        totalCount
                        pageInfo {
                            first
                            last
                            hasNext
                            hasPrevious
                        }
                        edges {
                            epoch {
                                id
                                duration
                                endTime
                                epochFee
                            }
                            cursor
                        }
                    }
                }
            `,
            variables() {
                return {
                    cursor: null,
                    count: this.itemsPerPage
                };
            },
            result(_data, _key) {
                let data;

                if (_key === "epochs") {
                    data = _data.data.epochs;

                    const edges = cloneObject(data.edges);

                    this.dHasNext = data.pageInfo.hasNext;

                    if (this.dItems.length === 0) {
                        this.dItems = edges;
                    } else {
                        for (let i = 0, len1 = edges.length; i < len1; i++) {
                            this.dItems.push(edges[i]);
                        }
                    }

                    this.$emit(
                        "records-count",
                        formatHexToInt(data.totalCount)
                    );
                }
            },
            error(_error) {
                this.queryError = _error.message;
            }
        }
    },

    data() {
        return {
            dItems: [],
            dHasNext: false,
            queryError: "",
            dColumns: [
                {
                    name: "id",
                    label: this.$t('epoch.epoch'),
                    itemProp: "epoch.id",
                    width: '120px',
                    formatter: _value => parseInt(_value, 16)
                },
                {
                    name: 'endTime',
                    label: this.$t('epoch.end_time'),
                    itemProp: 'epoch.endTime',
                    formatter: (_value) => formatDate(timestampToDate(_value)),
                    width: '340px'
                },
                {
                    name: 'duration',
                    label: this.$t('epoch.duration'),
                    itemProp: 'epoch.duration',
                    formatter: (_value) => formatDuration(formatHexToInt(_value)),
                    width: '340px'
                },
                /*{
                    name: 'baseReward',
                    label: this.$t('epoch.total_base_reward') + ' (FTM)',
                    itemProp: 'epoch.totalBaseRewardWeight',
                    formatter: (_value) => formatNumberByLocale(WEIToFTM(_value), 1, 2),
                    cssClass: 'align-end',
                },*/
                {
                    name: 'fee',
                    label: this.$t('epoch.total_fee') + ' (FTM)',
                    itemProp: 'epoch.epochFee',
                    formatter: (_value) => WEIToFTM(_value),
                    cssClass: 'align-end',
                },
                /*{
                    name: 'txReward',
                    label: this.$t('epoch.total_tx_reward') + ' (FTM)',
                    itemProp: 'epoch.totalTxRewardWeight',
                    formatter: (_value) => formatNumberByLocale(WEIToFTM(_value), 1, 2),
                    cssClass: 'align-end',
                }*/
            ]
        };
    },

    computed: {
        /**
         * Property is set to `true`, if 'contract-list-dt-mobile-view' breakpoint is reached.
         *
         * @return {Boolean}
         */
        cMobileView() {
            const dataTableBreakpoint = this.$store.state.breakpoints['contract-list-dt-mobile-view'];

            return (dataTableBreakpoint && dataTableBreakpoint.matches);
        },

        cLoading() {
            return this.$apollo.queries.epochs.loading;
        }
    },

    methods: {
        fetchMore() {
            const { epochs } = this;

            if (epochs && epochs.pageInfo && epochs.pageInfo.hasNext) {
                const cursor = epochs.pageInfo.last;

                this.$apollo.queries.epochs.fetchMore({
                    variables: {
                        cursor,
                        count: this.itemsPerPage
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return fetchMoreResult;
                    }
                });
            }
        },

        WEIToFTM,
        timestampToDate
    }
};
</script>
