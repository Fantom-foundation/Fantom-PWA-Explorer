<template>
    <f-card :off="fCardOff">
        <div class="f-data-table" :class="cCssClass" :id="dId" @page-change="onPageChange">
            <slot name="before-table">
                <div class="before-table" v-if="usePagination">
                    <f-pagination
                        :total-items="this.totalItems"
                        :items-per-page="this.itemsPerPage"
                        :curr-page="this.currPage"
                    ></f-pagination>
                </div>
            </slot>
            <div class="f-loading-container" v-show="loading">
                <div class="f-loading">{{$t('loading')}}</div>
            </div>
            <div class="table-container" :style="cHeight" v-if="columns.length">
                <table v-if="!cMobileView">
                    <slot name="header">
                        <thead>
                        <tr>
                            <th v-for="(col, index) in columns" :key="col.name" :class="getColumnClass(index)"
                                v-show="!col.hidden">{{col.label}}
                            </th>
                        </tr>
                        </thead>
                    </slot>
                    <slot>
                        <tbody v-if="cItems.length">
                        <tr v-for="item in cItems" :key="item.id" :style="item.css ? obj2css(item.css) : ''">
                            <td v-for="(col, index) in columns" :key="col.name" :class="getColumnClass(index)"
                                v-show="!col.hidden">
                                <slot :name="`column-${col.name}`"
                                      :value="(item[col.name] !== undefined ? item[col.name] : item[col.readValueFrom])">
                                    {{ (item[col.name] !== undefined ? item[col.name] : item[col.readValueFrom]) }}
                                </slot>
                            </td>
                        </tr>
                        </tbody>
                        <tbody v-else-if="!loading">
                        <tr>
                            <td :colspan="columns.length">
                                <slot name="no-items">
                                    <div class="no-items">{{$t('no_items')}}</div>
                                </slot>
                            </td>
                        </tr>
                        </tbody>
                    </slot>
                    <slot name="footer">
                        <tfoot>

                        </tfoot>
                    </slot>
                </table>
                <div v-else class="mobile-view f-data-layout">
                    <div v-if="cItems.length">
                        <div v-for="item in cItems" :key="item.id" :style="item.css ? obj2css(item.css) : ''"
                             class="mobile-item">
                            <div v-for="(col, index) in columns" :key="col.name" :class="getColumnClass(index)">
                                <template v-if="!col.hidden">
                                    <slot :name="`column-${col.name}`"
                                          :value="(item[col.name] !== undefined ? item[col.name] : item[col.readValueFrom])"
                                          :column="col">
                                        <div class="row no-collapse no-vert-col-padding">
                                            <div :class="`col-${firstMVColumnWidth} f-row-label`">{{ col.label }}:</div>
                                            <div class="col">{{ (item[col.name] !== undefined ? item[col.name] :
                                                item[col.readValueFrom]) }}
                                            </div>
                                        </div>
                                    </slot>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="!loading">
                        <div class="no-items">{{$t('no_items')}}</div>
                    </div>
                </div>
            </div>
            <slot name="after-table"></slot>

            <f-head-style :css="dCss"></f-head-style>
        </div>
    </f-card>
</template>

<script>
    import FHeadStyle from "./FHeadStyle.vue";
    import FPagination from "./FPagination.vue";
    import {isValidIndex} from "../utils/index.js";
    import {cloneObject, isObjectEmpty} from "../utils/index.js";
    import {obj2css} from "../utils/index.js";
    import helpers from "../mixins/helpers.js";
    import events from "../mixins/events.js";
    import FCard from "./FCard.vue";

    export default {
        mixins: [
            helpers, events
        ],

        components: {
            FCard,
            FHeadStyle,
            FPagination
        },

        props: {
            /**
             * Array of columns descriptions.
             *
             * One item is an object with keys:
             * `name` {string} - unique name of column (required)
             * `label` {string} - label of column placed in the header of table
             * `readValueFrom` {string} - if there is no key `name` in data item object, read value from column with name `value`
             * `width` {string} - minimum width of column
             * `hidden` {boolean} - if `true`, column will be hidden
             * `css` {object} - style for whole column. Keys are css properties in camel case, values are valid css values.
             * `cellChildrenCss` {object} - style for column cells direct children. Keys are css properties in camel case, values are valid css values.
             * `oneLineMode` {boolean} - if `true`, no line breaks are allowed in column's cells.
             */
            columns: {
                type: Array,
                required: true,
                default() {
                    return [];
                }
            },

            /**
             * Array of table rows.
             *
             * One item is an object, where keys are column names.
             * Reserved keys are:
             * `css` {object} - style for whole row. Keys are css properties in camel case, values are valid css values.
             */
            items: {
                type: Array,
                default() {
                    return [];
                }
            },

            /** Height of data table. */
            height: {
                type: String,
                default: 'auto'
            },

            /**
             * Width of first column in mobile view (from '1' to '12').
             * Used in mobile view slot's default content only.
             */
            firstMVColumnWidth: {
                type: String,
                default: '4'
            },

            /**  */
            fixedHeader: {
                type: Boolean,
                default: false
            },

            /** Server side pagination and sorting. */
            serverSide: {
                type: Boolean,
                default: false
            },

            /**  */
            usePagination: {
                type: Boolean,
                default: false
            },

            /** Display loading message. */
            loading: {
                type: Boolean,
                default: false
            },

            /** Render data table in mobile view. */
            mobileView: {
                type: Boolean,
                default: false
            },

            /** If `true`, no line breaks are allowed in table cells. */
            oneLineMode: {
                type: Boolean,
                default: false
            },

            /** If `true`, f-card element will be without any style. */
            fCardOff: {
                type: Boolean,
                default: true
            },

            ...FPagination.props
        },

        data() {
            return {
                dId: `tbl${this._uid}`,
                dCss: '',
                dPagination: {}
                // dItems: this.items
            }
        },

        computed: {
            /**
             * Property is set to `true`, if 'data-table-mobile-view' breakpoint is reached.
             *
             * @return {Boolean}
             */
            cMobileView() {
                const dataTableBreakpoint = this.$store.state.breakpoints['data-table-mobile-view'];

                return (dataTableBreakpoint && dataTableBreakpoint.matches) || this.mobileView;
            },

            /**
             * Get items (rows). If pagination is used, return proper slice of items.
             */
            cItems() {
                const {itemsIndices} = this.dPagination;

                this.setIds(this.items);

                if (!this.serverSide && this.usePagination) {
                    return (itemsIndices ? this.items.slice(itemsIndices.from, itemsIndices.to + 1) : []);
                } else {
                    return this.items;
                }
            },

            /**
             * Calculates max-height of data table.
             */
            cHeight() {
                if (this.height === 'auto') {
                    return '';
                }

                return `max-height: ${this.height}`;
            },

            /**
             * Container's css classes.
             */
            cCssClass() {
                return {
                    'f-card-on': !this.fCardOff,
                    'height-set': (this.height !== 'auto'),
                    'fixed-header': this.fixedHeader
                }
            }
        },

        created() {
            this.setColumnsCss();
        },

        methods: {
            setColumnsCss() {
                const {columns} = this;
                let cssStr = '';

                columns.forEach((_column, _index) => {
                    const css = {};
                    const cellChildrenCss = {};

                    if (_column.width) {
                        css.width = _column.width;
                        css.minWidth = css.width;
                    } else if (_column.minWidth) {
                        css.minWidth = _column.minWidth;
                    }

                    if (_column.css) {
                        Object.assign(css, _column.css);
                    }

                    if (_column.cellChildrenCss) {
                        Object.assign(cellChildrenCss, _column.cellChildrenCss);
                    }

                    if (this.oneLineMode || _column.oneLineMode) {
                        const threeDots = {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        };

                        Object.assign(css, threeDots);
                        // Object.assign(cellChildrenCss, threeDots);
                    }

                    if (!isObjectEmpty(css)) {
                        cssStr += `#${this.dId} .${this.getColumnClass(_index)} {${obj2css(css)}}`;
                    }

                    if (!isObjectEmpty(cellChildrenCss)) {
                        cssStr += `#${this.dId} .${this.getColumnClass(_index)} > * {${obj2css(cellChildrenCss)}}`;
                    }
                });

                if (cssStr) {
                    this.dCss = cssStr;
                }
            },

            /**
             * @param {int} _index
             * @param {object} _data
             * @return {boolean}
             */
            updateRow(_index, _data) {
                if (isValidIndex(_index, this.items)) {
                    this.$set(this.items, _index, _data);
                    return true;
                }

                return false;
            },

            /**
             * @param {int} _rowIndex
             * @param {string} _colName
             * @param {*} _data
             * @return {boolean}
             */
            updateCell(_rowIndex, _colName, _data) {
                if (isValidIndex(_rowIndex, this.items)) { // && _colName in columnsByName (object)!!
                    this.$set(this.items[_rowIndex], _colName, _data);
                    return true;
                }

                return false;
            },

            /**
             * Get column's css class.
             *
             * @param {int} _index
             * @return {string}
             */
            getColumnClass(_index) {
                return `_c${_index}`;
            },

            /**
             * Triggered on `FPagination`'s `'page-change'` event.
             *
             * @param {Object} _data
             */
            onPageChange(_data) {
                this.dPagination = cloneObject(_data.detail);
            },

            /**
             * Convert object, where keys are css properties, to string.
             *
             * @param {object} _cssObj
             * @return {string}
             */
            obj2css: obj2css
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-data-table {
        position: relative;

        .before-table {
            text-align: right;
            margin-bottom: 0.5rem;
        }

        table {
            width: 100%;
            border-collapse: initial;
            /*border-spacing: 0;*/
            border-spacing: 0 8px;
            table-layout: fixed;
        }

        th {
            font-weight: bold;
        }

        td, th {
            padding: 12px 16px;
            word-break: break-word;
            line-height: 1.2;
        }

        tr {
            td {
                background-color: #fff;

/*
                &:first-child {
                    border-radius: 8px 0 0 8px;
                }

                &:last-child {
                    border-radius: 0 8px 8px 0;
                }
*/
            }
        }

        thead {
            th {
                color: #666;
                background-color: $body-bg-color;
                /*border-bottom: 1px solid #e6e6e6;*/
            }
        }

        &.fixed-header {
            /*position: relative;*/

            thead th {
                position: -webkit-sticky;
                position: sticky;
                top: var(--f-header-height);
                z-index: 2;
            }

            &.height-set {
                thead th {
                    top: 0;
                }
            }
        }

        .mobile-view {
            .mobile-item {
                padding: 0.5rem;
                background-color: #fff;
                border-radius: 0.5rem;
                box-shadow: $elev2-shadow;
                margin-bottom: 1rem;

                > div {
                    width: 100% !important;
                    min-width: 100% !important;
                    text-align: left !important;
                }
            }
        }

        .f-pagination {

        }

        .f-loading-container {
            position: -webkit-sticky;
            position: sticky;
            top: var(--f-header-height);
            z-index: 3;

            .f-loading {
                position: absolute;
                /*top: 80px;*/
                top: 48px;
                left: 50%;
                margin-left: -60px;
                width: 120px;
                text-align: center;
                padding: 0.5rem 1rem;
                color: #fff;
                border-radius: 4px;
                background-color: #555;
                box-shadow: $elev8-shadow;
                z-index: 4;
            }
        }

        .no-items {
            text-align: center;
        }

        &.f-card-on {
            thead th {
                background-color: #fff;
            }

            .mobile-view {
                .mobile-item {
                    border-radius: 0;
                    box-shadow: none;
                    margin-bottom: 1rem;
                    padding: 0 0 1rem 0;
                    border-bottom: 1px solid #e6e6e6;

                    &:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                        padding-bottom: 0;
                    }
                }
            }
        }

        &.height-set {
            .table-container {
                overflow: auto;
            }

            /*
                        .f-loading-container {
                            top: 0;
                        }
            */
        }
    }
</style>
