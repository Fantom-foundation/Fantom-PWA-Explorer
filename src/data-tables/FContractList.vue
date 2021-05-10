<template>
    <div class="contract-list-dt">
        <template v-if="!dContractListError">
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
                <template v-slot:column-addressname="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}</div>
                        <div class="col-8">
                            <router-link :to="{name: 'address-detail', params: {id: value.address}}" :title="value.address">
                                <f-ellipsis :text="value.address" overflow="middle" />
                            </router-link>
                            <span class="contract-name">{{ value.name }}</span>
                        </div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'address-detail', params: {id: value.address}}" :title="value.address">
                            <f-ellipsis :text="value.address" overflow="middle" />
                        </router-link>
                        <span class="contract-name">{{ value.name }}</span>
                    </template>
                </template>
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ dContractListError }}</div>
        </template>
    </div>
</template>

<script>
import FDataTable from "../components/core/FDataTable/FDataTable.vue";
import gql from "graphql-tag";
import { WEIToFTM } from "../utils/transactions.js";
import {timestampToDate, formatHexToInt, formatDate} from "../filters.js";
import FEllipsis from "../components/core/FEllipsis/FEllipsis.vue";
import {cloneObject} from "@/utils";

export default {
    name: "FContractList",

    components: {
        FEllipsis,
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
        contracts: {
            query: gql`
                query ContractList($cursor: Cursor, $count: Int!) {
                    contracts(cursor: $cursor, count: $count) {
                        totalCount
                        pageInfo {
                            first
                            last
                            hasNext
                            hasPrevious
                        }
                        edges {
                            contract {
                                address
                                deployedBy {
                                    hash
                                }
                                transactionHash
                                name
                                version
                                compiler
                                validated
                                timestamp
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

                if (_key === "contracts") {
                    // console.log('???');
                    data = _data.data.contracts;

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
                this.dContractListError = _error.message;
            }
        }
    },

    data() {
        return {
            dItems: [],
            dHasNext: false,
            dContractListError: "",
            dColumns: [
                {
                    name: "addressname",
                    label: `${this.$t("view_contract_list.address")} / ${this.$t("view_contract_list.name")}`,
                    itemProp: "contract",
                    width: '400px',
                },
                {
                    name: "validated",
                    label: this.$t("view_contract_list.validated"),
                    itemProp: "contract.validated",
                    formatter: (_value) => formatDate(timestampToDate(_value)),
                },
                {
                    name: "timestamp",
                    label: this.$t("view_contract_list.timestamp"),
                    itemProp: "contract.timestamp",
                    formatter: (_value) => formatDate(timestampToDate(_value)),
                },
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
            return this.$apollo.queries.contracts.loading;
        }
    },

    methods: {
        fetchMore() {
            const { contracts } = this;

            if (contracts && contracts.pageInfo && contracts.pageInfo.hasNext) {
                const cursor = contracts.pageInfo.last;

                this.$apollo.queries.contracts.fetchMore({
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

<style lang="scss">
    .contract-list-dt {
        .contract-name {
            display: block;
            padding-top: 4px;
        }
    }
</style>
