<template>
    <div class="hometransactionlist animlist">
        <transition enter-active-class="fadelong-enter-active">
            <f-data-table
                v-show="show"
                :columns="dColumns"
                :hidden-columns="hiddenColumns"
                :items="dItems"
                :loading="cLoading"
                f-card-off
                first-m-v-column-width="5"
                fixed-header
                action-on-row
                @row-action="onRowAction"
                v-bind="{...$attrs, ...$props}"
                class="f-data-table-body-bg-color"
            >
                <template v-slot:column-hash="{ value, column, col }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            {{ value | formatHash }}
                        </div>
                    </div>
                    <template v-else>
                        <div class="animlist_label">
                            {{ col.label }} &rsaquo;
                        </div>
                        <span>{{ value | formatHash }}</span>
                    </template>
                </template>

                <template v-slot:column-timestamp="{ value, column, col }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                        </div>
                    </div>
                    <template v-else>
                        <div class="animlist_label">
                            {{ col.label }}
                        </div>
                        <span>
                            <timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                        </span>
                    </template>
                </template>

                <template v-slot:column-amount="{ value, item, column, col }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-5 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            {{ value }}
                        </div>
                    </div>
                    <template v-else>
                        <div class="animlist_label">
                            {{ col.label }}
                        </div>
                        <span> {{ value }} </span>
                    </template>
                </template>
            </f-data-table>
        </transition>
    </div>
</template>

<script>
import {pollingMixin} from "@/mixins/polling.js";
import FDataTable from "@/components/core/FDataTable/FDataTable.vue";
import {cloneObject, getNestedProp} from "@/utils";
import {formatHash, formatNumberByLocale, numToFixed, timestampToDate} from "@/filters.js";
import {WEIToFTM} from "@/utils/transactions.js";
import gql from "graphql-tag";
import {GridRowsAnimation} from "@/utils/GridRowsAnimation.js";

const rowsAnimation = new GridRowsAnimation({
    itemIdPropName: 'id',
    rowsSelector: '.hometransactionlist [data-dt-item-id="ITEM_ID"]',
    animationOptions: {
        translateX: ['60%', 0],
        opacity: [0, 1],
        duration: 250,
    },
});

export default {
    name: "HomeTransactionList",

    components: {FDataTable},

    mixins: [pollingMixin],

    props: {
        // ...FTransactionList.props,
        /** Number of items per page. */
        itemsPerPage: {
            type: Number,
            default: 40
        },
        /** Use address column instead of columns `from` and `to`. */
        addressCol: {
            type: String,
            default: ''
        },
        /** Array of column names to be hidden. */
        hiddenColumns: {
            type: Array,
            default() {
                return [];
            }
        },
    },

    data() {
        return {
            show: true,
            dItems: [],
            dHasNext: false,
            // dOutsideData: !!this.items.action,
            dTransactionListError: '',
            dColumns: [
                {
                    name: 'hash',
                    label: this.$t('view_transaction_list.tx_hash'),
                    width: '200px',
                    itemProp: `${!this.withoutCursor ? 'transaction.' : ''}hash`
                },
                {
                    name: 'timestamp',
                    label: this.$t('view_transaction_list.time'),
                    itemProp: `${!this.withoutCursor ? 'transaction.' : ''}block.timestamp`,
                    // width: '220px',
                    hidden: this.cMobileView
                },
                {
                    name: 'amount',
                    label: `${this.$t('view_transaction_list.amount')} (FTM)`,
                    itemProp: `${!this.withoutCursor ? 'transaction.' : ''}value`,
                    formatter: _value => {
                        return formatNumberByLocale(numToFixed(WEIToFTM(_value), 2), 2)
                    },
                    width: '130px',
/*
                    css: {
                        textAlign: 'right'
                    }
*/
                }
            ],
        }
    },

    computed: {
        cLoading() {
            return this.dItems.length === 0;
        }
    },

    created() {
        this.updateItems();
        this._updatingTxs = false;
    },

    mounted() {
        setTimeout(() => {
            this._polling.start(
                'update-transactions',
                () => {
                    if (!this._updatingTxs) {
                        this._updatingTxs = true;
                        this.updateItems(true);
                    }
                },
                3500
            );
        }, 1750);
    },

    methods: {
        async updateItems() {
            this.dItems = await this.fetchData();

            setTimeout(() => {
                rowsAnimation.animate(this.dItems);
            }, 1);

            this._updatingTxs = false;
        },


        /**
         * @returns {Promise<Array>}
         */
        async fetchData() {
            const data = await this.$apollo.query({
                query: gql`
                    query TransactionList($cursor: Cursor, $count: Int!) {
                        transactions (cursor: $cursor, count: $count) {
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            totalCount
                            edges {
                                cursor
                                transaction {
                                    hash
                                    from
                                    to
                                    value
                                    gasUsed
                                    block {
                                        number
                                        timestamp
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: {
                    cursor: null,
                    count: this.itemsPerPage
                },
                fetchPolicy: 'network-only',
            });

            return cloneObject(data.data && data.data.transactions && data.data.transactions.edges ? data.data.transactions.edges : []);
        },

        /**
         * Get item's 'from' value.
         *
         * @param {Object} _item
         * @return {*}
         */
        getFrom(_item) {
            return getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}from`)
        },

        /**
         * Get item's 'to' value.
         *
         * @param {Object} _item
         * @return {*}
         */
        getTo(_item) {
            return getNestedProp(_item, `${!this.withoutCursor ? 'transaction.' : ''}to`)
        },

        onRowAction(item) {
            this.$router.push({name: 'transaction-detail', params: {id: item.transaction.hash}})
        },

        WEIToFTM,
        timestampToDate,
        numToFixed,
        formatHash,
        formatNumberByLocale
    }
}
</script>

<style scoped>

</style>
