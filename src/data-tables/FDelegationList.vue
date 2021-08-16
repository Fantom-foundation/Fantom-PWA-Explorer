<template>
    <div class="delegation-list-dt">
        <template v-if="!dBlockListError">
            <f-data-table
                :columns="dColumns"
                :items="dItems"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                first-m-v-column-width="5"
                infinite-scroll
                fixed-header
                class="f-data-table-body-bg-color"
                @loader-visibility="onLoaderVisibility"
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

                <template v-slot:column-amount="{ value, item, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col break-word">
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
            <div class="query-error">{{ dBlockListError }}</div>
        </template>
    </div>
</template>

<script>
    import FDataTable from "../components/core/FDataTable/FDataTable.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import {formatHexToInt, timestampToDate, formatNumberByLocale, numToFixed, formatDate} from "../filters.js";
    import {cloneObject} from "@/utils";
    import FTokenValue from "@/components/core/FTokenValue/FTokenValue.vue";

    export default {
        components: {
            FTokenValue,
            FDataTable
        },

        props: {
            /** */
            stakerId: {
                type: String,
                default: ''
            },
            /** Number of items per page. */
            itemsPerPage: {
                type: Number,
                default: 20
            }
        },

        apollo: {
            delegationsOf: {
                query: gql`
                    query DelegationList($staker: BigInt!, $cursor: Cursor, $count: Int!) {
                        delegationsOf(staker: $staker, cursor: $cursor, count: $count) {
                            totalCount
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            edges {
                                cursor
                                delegation {
                                    address
                                    amount
                                    createdTime
                                }
                            }
                        }
                    }
                `,
                skip() {
                    return !this.stakerId;
                },
                variables() {
                    return {
                        staker: this.stakerId,
                        cursor: null,
                        count: this.itemsPerPage
                    }
                },
                result(_data, _key) {
                    let data;


                    if (_key === 'delegationsOf') {
                        data = _data.data.delegationsOf;

                        const edges = cloneObject(data.edges);

                        this.dHasNext = data.pageInfo.hasNext;

                        if (this.dItems.length === 0) {
                            this.dItems = edges;
                        } else {
                            for (let i = 0, len1 = edges.length; i < len1; i++) {
                                this.dItems.push(edges[i]);
                            }

                            if (this.loaderVisible) {
                                this.fetchMore();
                            }
                        }

                        this.$emit('records-count', formatHexToInt(data.totalCount));
                    }
                },
                error(_error) {
                    this.dBlockListError = _error.message;
                }
            }
        },

        data() {
            return {
                dItems: [],
                dHasNext: false,
                dBlockListError: '',
                loaderVisible: false,
                dColumns: [
                    {
                        name: 'address',
                        label: this.$t('delegation_list_dt.address'),
                        itemProp: 'delegation.address'
                    },
                    {
                        name: 'createdTime',
                        label: this.$t('delegation_list_dt.created_on'),
                        itemProp: 'delegation.createdTime',
                        formatter: _value => formatDate(timestampToDate(formatHexToInt(_value)))
                    },
                    {
                        name: 'amount',
                        label: this.$t('delegation_list_dt.amount'),
                        itemProp: 'delegation.amount',
                        formatter: _value => WEIToFTM(_value),
                        cssClass: 'align-end',
                    }
                ]
            }
        },

        computed: {
            /**
             * @return {boolean}
             */
            cLoading() {
                return this.$apollo.queries.delegationsOf.loading;
            },

            /**
             * Property is set to `true`, if 'tdelegation-list-dt-mobile-view' breakpoint is reached.
             *
             * @return {boolean}
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
            fetchMore() {
                const {delegationsOf} = this;

                if (delegationsOf && delegationsOf.pageInfo && delegationsOf.pageInfo.hasNext) {
                    const cursor = delegationsOf.pageInfo.last;

                    this.$apollo.queries.delegationsOf.fetchMore({
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

            onLoaderVisibility(_visible) {
                this.loaderVisible = _visible;

                if (this.loaderVisible && !this.cLoading) {
                    this.fetchMore();
                }
            },

            WEIToFTM,
            timestampToDate,
            formatHexToInt,
            formatNumberByLocale,
            numToFixed,
            formatDate
        }
    }
</script>
