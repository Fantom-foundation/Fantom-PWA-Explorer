<template>
    <div class="f-pagination">
        <button class="first same-size small round" @click="onFirstItemButClick" :disabled="cDisablePrevButs">&lt;&lt;</button>
        <button class="prev same-size small round" @click="onPrevItemButClick" :disabled="cDisablePrevButs">&lt;</button>

        <span class="pages">
            <slot name="pages" :data="getState()">{{ dCurrPage }} of {{ cNumPages }}</slot>
        </span>

        <button class="next same-size small round" @click="onNextItemButClick" :disabled="cDisableNextButs">&gt;</button>
        <button class="last same-size small round" @click="onLastItemButClick" :disabled="cDisableNextButs">&gt;&gt;</button>
    </div>
</template>

<script>
    import events from "../mixins/events.js";

    export default {
        mixins: [events],

        props: {
            /** Total amount of items. */
            totalItems: {
                type: Number,
                default: 0
            },

            /** Number of items per page. */
            itemsPerPage: {
                type: Number,
                default: 20
            },

            /** Current page index. */
            currPage: {
                type: Number,
                default: 1
            }
        },

        data() {
            return {
                /** Current page index. */
                dCurrPage: this.currPage
            }
        },

        computed: {
            /**
             * Returns number of pages.
             *
             * @return {int}
             */
            cNumPages() {
                return Math.max(Math.ceil(this.totalItems / this.itemsPerPage), 1);
            },

            /**
             * Get `from` and `to` indices according to current page.
             *
             * @return {object}
             */
            cItemsIndices() {
                return {
                    from: (this.dCurrPage - 1) * this.itemsPerPage,
                    to: (this.dCurrPage * this.itemsPerPage) - 1
                };
            },

            cDisablePrevButs() {
                return (this.dCurrPage <= 1);
            },

            cDisableNextButs() {
                return (this.dCurrPage >= this.cNumPages);
            }
        },

        created() {
            this.goToPage(this.dCurrPage);
        },

        methods: {
            /**
             * @param {int} _pageNum
             */
            goToPage(_pageNum) {
                this.dCurrPage = Math.min(Math.max(_pageNum, 1), this.cNumPages);
                this.$nextTick(() => {this.emitCustomEvent('page-change', this.getState())});
            },

            /**
             * Get pagination state.
             *
             * @return {{numPages: (default.computed.cNumPages|(function(): number)), totalItems: (default.props.totalItems|{default, type}), currPage: (default.props.currPage|{default, type}|*), itemsPerPage: (default.props.itemsPerPage|{default, type}), itemsIndices: (default.computed.cItemsIndices|(function(): {from: number, to: number}))}}
             */
            getState() {
                return {
                    totalItems: this.totalItems,
                    itemsPerPage: this.itemsPerPage,
                    currPage: this.dCurrPage,
                    numPages: this.cNumPages,
                    itemsIndices: this.cItemsIndices
                }
            },

            onFirstItemButClick() {
                this.goToPage(1);
            },

            onPrevItemButClick() {
                this.goToPage(this.dCurrPage - 1);
            },

            onNextItemButClick() {
                this.goToPage(this.dCurrPage + 1);
            },

            onLastItemButClick() {
                this.goToPage(this.cNumPages);
            }
        }
    }
</script>

<style lang="scss">
    .f-pagination {
        display: inline-block;

        .pages {
            display: inline-block;
            vertical-align: middle;
            padding: 0 16px;
        }

        button {
            margin-inline-end: 4px;

            &:last-child {
                margin-inline-end: 0;
            }
        }
    }
</style>
