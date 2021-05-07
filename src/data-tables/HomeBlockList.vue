<template>
    <div class="homeblocklist">
        <transition enter-active-class="fadelong-enter-active">
            <f-data-table
                v-show="show"
                :columns="dColumns"
                :items="dItems"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                fixed-header
                f-card-off
                mobile-view
                height="300px"
                v-bind="{...$attrs, ...$props}"
                class="f-data-table-body-bg-color"
            >
                <template v-slot:column-block="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <router-link :to="{name: 'block-detail', params: {id: value}}" :title="value">{{value}}</router-link>
                        </div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'block-detail', params: {id: value}}" :title="value">{{value}}</router-link>
                    </template>
                </template>

                <template v-slot:column-age="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <timeago :datetime="timestampToDate(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                        </div>
                    </div>
                    <template v-else>
                        <timeago :datetime="timestampToDate(value)" :auto-update="5" :converter-options="{includeSeconds: true}"></timeago>
                    </template>
                </template>
            </f-data-table>
        </transition>
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
            6000
        );
    },

    methods: {
        async updateItems(_animate) {
            this.dItems = await this.fetchData();

            if (_animate) {
                this.show = false;

                this.$nextTick(() => {this.show = true;});
            }
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

        WEIToFTM,
        timestampToDate
    }
}
</script>
