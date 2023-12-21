<template>
    <div class="homeblocklist animlist">
        <f-data-table
            v-show="show"
            :columns="dColumns"
            :items="dItems"
            :disable-infinite-scroll="!dHasNext"
            :loading="cLoading"
            fixed-header
            f-card-off
            action-on-row
            @row-action="onRowAction"
            v-bind="{...$attrs, ...$props}"
            class="f-data-table-body-bg-color"
        >
            <template #header><span></span></template>

            <template v-slot:column-block="{ value, column, col }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}</div>
                    <div class="col">
                        {{ value }}
                    </div>
                </div>
                <template v-else>
                    <div class="animlist_label">
                        {{ col.label }} &rsaquo;
                    </div>
                    <span>{{ value }}</span>
                </template>
            </template>

            <template v-slot:column-age="{ value, column, col }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}</div>
                    <div class="col">
                        <timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                    </div>
                </div>
                <template v-else>
                    <div class="animlist_label">
                        {{ col.label }}
                    </div>
                    <span>
                        <timeago :datetime="timestampToDate(value)" :auto-update="5" :converter-options="{includeSeconds: true}"></timeago>
                    </span>
                </template>
            </template>

            <template v-slot:column-transaction_count="{ value, column, col }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}</div>
                    <div class="col"> {{ value }} </div>
                </div>
                <template v-else>
                    <div class="animlist_label">
                        {{ col.label }}
                    </div>
                    <span>{{ value }}</span>
                </template>
            </template>
        </f-data-table>
    </div>
</template>

<script>
import FBlockList from "@/data-tables/FBlockList.vue";
import FDataTable from "@/components/core/FDataTable/FDataTable.vue";
import {WEIToFTM} from "@/utils/transactions.js";
import {timestampToDate} from "@/filters.js";
import gql from "graphql-tag";
import {cloneObject} from "@/utils";
import {pollingMixin} from "@/mixins/polling.js";
import {GridRowsAnimation} from "@/utils/GridRowsAnimation.js";

const rowsAnimation = new GridRowsAnimation({
    itemIdPropName: 'id',
    rowsSelector: '.homeblocklist [data-dt-item-id="ITEM_ID"]',
    animationOptions: {
        translateX: ['-60%', 0],
        opacity: [0, 1],
        duration: 250,
    },
});

export default {
    name: "HomeBlockList",

    mixins: [pollingMixin],

    components: {FDataTable},

    props: {
        ...FBlockList.props,
    },

    data() {
        return {
            ...FBlockList.data.call(this),
            show: true,
        }
    },

    computed: {
        cLoading() {
            return this.dItems.length === 0;
        }
    },

    created() {
        this.updateItems();
    },

    mounted() {
        this._polling.start(
            'update-blocks',
            () => {
                this.updateItems(true);
            },
            4800
        );
    },

    methods: {
        async updateItems() {
            this.dItems = await this.fetchData();

            setTimeout(() => {
                rowsAnimation.animate(this.dItems);
            }, 1);
        },

        /**
         * @returns {Promise<Array>}
         */
        async fetchData() {
            const data = await this.$apollo.query({
                query: gql`
                    query BlockList($cursor: Cursor, $count: Int!) {
                        blocks (cursor: $cursor, count: $count) {
                            totalCount
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            edges {
                                block {
                                    hash
                                    number
                                    timestamp
                                    transactionCount
                                    gasUsed
                                }
                                cursor
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

            return cloneObject(data.data && data.data.blocks && data.data.blocks.edges ? data.data.blocks.edges : []);
        },

        onRowAction(item) {
            this.$router.push({name: 'block-detail', params: {id: item.block.number}})
        },

        WEIToFTM,
        timestampToDate
    }
}
</script>
