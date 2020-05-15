<template>
    <div class="contract-list-dt">
        <template v-if="!dContractListError">
            <f-data-table
                :columns="dColumns"
                :items="dItems"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                infinite-scroll
                fixed-header
                @fetch-more="fetchMore"
            >
                <template v-slot:column-address="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col"><router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value }}</router-link></div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'address-detail', params: {id: value}}" :title="value">{{ value }}</router-link>
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
import FDataTable from "../components/FDataTable.vue";
import gql from "graphql-tag";
import { WEIToFTM } from "../utils/transactions.js";
import { timestampToDate, formatHexToInt } from "../filters.js";

export default {
    name: "FContractList",

    components: {
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

                    const edges = data.edges;

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
                    name: "address",
                    label: this.$t("view_contract_list.address"),
                    itemProp: "contract.address",
                },
/*
                {
                    name: "name",
                    label: this.$t("view_contract_list.name"),
                    itemProp: "contract.name",
                },
                {
                    name: "compiler",
                    label: this.$t("view_contract_list.compiler"),
                    itemProp: "contract.compiler",
                },
*/
            ]
        };
    },

    computed: {
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
