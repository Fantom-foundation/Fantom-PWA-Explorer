<template>
    <f-card :off="fCardOff" class="f-data-table-card">
        <div :id="dId" class="f-data-table" :class="cCssClass" @page-change="onPageChange">
            <slot name="before-table">
                <div v-if="usePagination" class="before-table">
                    <f-pagination
                        :total-items="totalItems"
                        :items-per-page="itemsPerPage"
                        :curr-page="currPage"
                    ></f-pagination>
                </div>
            </slot>
            <div
                v-if="columns.length"
                class="table-container"
                :style="cHeight"
                @click="onTableClick"
                @keyup="onTabletKeyup"
            >
                <table v-if="!cMobileView">
                    <slot name="header">
                        <thead>
                            <tr @click="onHeaderClick">
                                <th
                                    v-for="(col, index) in columns"
                                    v-show="!col.hidden"
                                    :key="col.name"
                                    :class="getColumnClass(index, col) + ' ' + getHeadingColumnClass(col)"
                                >
                                    <div>{{ col.label }}</div>
                                </th>
                            </tr>
                        </thead>
                    </slot>
                    <slot>
                        <tbody v-if="cItems.length">
                            <tr
                                v-for="item in cItems"
                                :key="item.id"
                                :style="item.css ? obj2css(item.css) : ''"
                                :data-dt-item-id="actionOnRow ? item.id : undefined"
                                :tabindex="actionOnRow ? 0 : -1"
                            >
                                <td
                                    v-for="(col, index) in columns"
                                    v-show="!col.hidden"
                                    :key="col.name"
                                    :class="getColumnClass(index, col)"
                                >
                                    <slot
                                        :name="`column-${col.name}`"
                                        :value="getItemPropValue(item, col)"
                                        :item="item"
                                    >
                                        {{ getItemPropValue(item, col) }}
                                    </slot>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else-if="!loading">
                            <tr>
                                <td :colspan="dVisibleColumnsNum">
                                    <slot name="no-items">
                                        <div class="no-items">{{ $t('no_items') }}</div>
                                    </slot>
                                </td>
                            </tr>
                        </tbody>
                    </slot>
                    <slot name="footer">
                        <tfoot>
                            <tr v-if="infiniteScroll && cItems.length" v-show="!disableInfiniteScroll">
                                <td :colspan="dVisibleColumnsNum">
                                    <div v-observe-visibility="dObserveVisibilityOptions" class="f-loading-more">
                                        <pulse-loader color="#1969ff"></pulse-loader>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="loading && (!cItems.length || forceLoading)">
                                <td :colspan="dVisibleColumnsNum">
                                    <div class="f-loading-more">
                                        <pulse-loader color="#1969ff"></pulse-loader>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </slot>
                </table>

                <div v-else class="mobile-view f-data-layout normal-padding">
                    <div v-if="cItems.length">
                        <div
                            v-for="item in cItems"
                            :key="item.id"
                            :style="item.css ? obj2css(item.css) : ''"
                            :data-dt-item-id="actionOnRow ? item.id : undefined"
                            :tabindex="actionOnRow ? 0 : -1"
                            class="mobile-item"
                        >
                            <div v-for="(col, index) in columns" :key="col.name" :class="getColumnClass(index, col)">
                                <template v-if="!col.hidden">
                                    <slot
                                        :name="`column-${col.name}`"
                                        :value="getItemPropValue(item, col)"
                                        :item="item"
                                        :column="col"
                                    >
                                        <div class="row no-collapse no-vert-col-padding">
                                            <div :class="`col-${firstMVColumnWidth} f-row-label`">{{ col.label }}</div>
                                            <div class="col break-word">{{ getItemPropValue(item, col) }}</div>
                                        </div>
                                    </slot>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="!loading">
                        <div class="no-items">{{ $t('no_items') }}</div>
                    </div>

                    <div v-if="infiniteScroll && cItems.length" v-show="!disableInfiniteScroll">
                        <div v-observe-visibility="dObserveVisibilityOptions" class="f-loading-more">
                            <pulse-loader color="#1969ff"></pulse-loader>
                        </div>
                    </div>

                    <div v-if="loading && (!cItems.length || forceLoading)">
                        <div class="f-loading-more">
                            <pulse-loader color="#1969ff"></pulse-loader>
                        </div>
                    </div>
                </div>
            </div>
            <slot name="after-table"></slot>

            <f-head-style :css="dCss"></f-head-style>
        </div>
    </f-card>
</template>

<script>
import FHeadStyle from '../FHeadStyle/FHeadStyle.vue';
import FPagination from '../FPagination/FPagination.vue';
import { getNestedProp, isValidIndex } from '../../../utils';
import { cloneObject, isObjectEmpty } from '../../../utils';
import { obj2css } from '../../../utils';
import { helpersMixin } from '../../../mixins/helpers.js';
import events from '../../../mixins/events.js';
import FCard from '../FCard/FCard.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { isAriaAction } from '@/utils/aria.js';

export default {
    components: {
        FCard,
        FHeadStyle,
        FPagination,
        PulseLoader,
    },

    mixins: [helpersMixin, events],

    props: {
        /**
         * Array of columns descriptions.
         *
         * One item is an object with keys:
         * `name` {string} - unique name of column (required). Can be used as a data item property.
         * `label` {string} - label of column placed in the header of table
         * `itemProp` {string} - can be used to get data from nested data item property - 'prop1.prop2' for example
         * `formatter` {function} - apply this formatter to data item value
         * `readValueFrom` {string} - if there is no key `name` in data item object, read value from column with name `value`
         * `width` {string} - minimum width of column
         * `hidden` {boolean} - if `true`, column will be hidden
         * `css` {object} - style for whole column. Keys are css properties in camel case, values are valid css values.
         * `cssClass` {string} - css class to be added to column
         * `cellChildrenCss` {object} - style for column cells direct children. Keys are css properties in camel case, values are valid css values.
         * `oneLineMode` {boolean} - if `true`, no line breaks are allowed in column's cells.
         */
        columns: {
            type: Array,
            required: true,
            default() {
                return [];
            },
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
            },
        },

        /** Height of data table. */
        height: {
            type: String,
            default: 'auto',
        },

        /** Array of column names to be hidden. */
        hiddenColumns: {
            type: Array,
            default() {
                return [];
            },
        },

        /**
         * Width of first column in mobile view (from '1' to '12').
         * Used in mobile view slot's default content only.
         */
        firstMVColumnWidth: {
            type: String,
            default: '4',
        },

        /**  */
        fixedHeader: {
            type: Boolean,
            default: false,
        },

        /** Enable infinite scrolling. */
        infiniteScroll: {
            type: Boolean,
            default: false,
        },

        /**
         * The minimum distance between the bottom of the element and the bottom of the viewport
         * before the v-infinite-scroll method is executed.
         */
        infiniteScrollDistance: {
            type: Number,
            default: 1100,
        },

        /**  */
        disableInfiniteScroll: {
            type: Boolean,
            default: true,
        },

        /** Server side pagination and sorting. */
        serverSide: {
            type: Boolean,
            default: false,
        },

        /**  */
        usePagination: {
            type: Boolean,
            default: false,
        },

        /** Display loading message. */
        loading: {
            type: Boolean,
            default: false,
        },

        /** Display loading message, even if items exist. */
        forceLoading: {
            type: Boolean,
            default: false,
        },

        /** Render data table in mobile view. */
        mobileView: {
            type: Boolean,
            default: false,
        },

        /** If `true`, no line breaks are allowed in table cells. */
        oneLineMode: {
            type: Boolean,
            default: false,
        },

        /** If `true`, f-card element will be without any style. */
        fCardOff: {
            type: Boolean,
            default: false,
        },

        /** No left padding on the first column and right padding on the last column. */
        noFLPadding: {
            type: Boolean,
            default: false,
        },

        /** If `true`, row will become clickable and 'row-action' event will be triggered. */
        actionOnRow: {
            type: Boolean,
            default: false,
        },

        ...FPagination.props,
    },

    data() {
        return {
            dId: `tbl${this._uid}`,
            dCss: '',
            dPagination: {},
            dObserveVisibilityOptions: {
                callback: this.fetchMore,
                intersection: {
                    rootMargin: `${this.infiniteScrollDistance}px`,
                },
            },
            dVisibleColumnsNum: 0,
            // dItems: this.items
        };
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
            const { itemsIndices } = this.dPagination;

            this.setIds(this.items);

            if (!this.serverSide && this.usePagination) {
                return itemsIndices ? this.items.slice(itemsIndices.from, itemsIndices.to + 1) : [];
            } else {
                if (this.items.length > 0) {
                    this.initialSort();
                }

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
                'height-set': this.height !== 'auto',
                'fixed-header': this.fixedHeader,
                'no-fl-padding': this.noFLPadding || !this.fCardOff,
                'action-on-row': this.actionOnRow,
            };
        },
    },

    created() {
        this.colClassRE = /\s*_c(\d)\s*/;
        this._sortByCol = -1;
        this._initialSort = true;

        this.prepareColumns();
    },

    methods: {
        initialSort() {
            if (this._initialSort) {
                this._initialSort = false;

                setTimeout(() => {
                    if (this._sortByCol > -1) {
                        const column = this.columns[this._sortByCol];
                        this.sortByColumn(column, column.sortDir);
                    }
                }, 10);
            }
        },

        /**
         * Set columns css, ...
         */
        prepareColumns() {
            const { columns } = this;
            const hiddenColumns = this.hiddenColumns.length > 0 ? this.hiddenColumns : null;
            let cssStr = '';
            let dVisibleColumnsNum = 0;
            let firstVisible = false;

            columns.forEach((_column, _index) => {
                const css = {};
                const cellChildrenCss = {};

                _column._index = _index;

                if (_column.sortDir) {
                    this._sortByCol = _index;
                }

                if (hiddenColumns && hiddenColumns.indexOf(_column.name) > -1) {
                    _column.hidden = true;
                }

                if (!_column.hidden) {
                    dVisibleColumnsNum++;

                    if (!firstVisible) {
                        firstVisible = true;

                        _column.cssClass = `${_column.cssClass || ''} f-col`;
                    }
                }

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
                        textOverflow: 'ellipsis',
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

            for (let i = columns.length - 1; i >= 0; i--) {
                if (!columns[i].hidden) {
                    columns[i].cssClass = `${columns[i].cssClass || ''} l-col`;
                    break;
                }
            }

            if (cssStr) {
                this.dCss = cssStr;
            }

            if (dVisibleColumnsNum > 0) {
                this.dVisibleColumnsNum = dVisibleColumnsNum;
            }
        },

        /**
         * Fetch more data.
         */
        fetchMore(_visible) {
            if (_visible) {
                this.$emit('fetch-more');
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
            if (isValidIndex(_rowIndex, this.items)) {
                // && _colName in columnsByName (object)!!
                this.$set(this.items[_rowIndex], _colName, _data);
                return true;
            }

            return false;
        },

        /**
         * Get column's css class.
         *
         * @param {int} _index
         * @param {object} [_column]
         * @return {string}
         */
        getColumnClass(_index, _column) {
            return `_c${_index} ` + (_column && _column.cssClass ? _column.cssClass : '');
        },

        /**
         * Get heading column's css classes.
         *
         * @param {object} [_column]
         * @return {string}
         */
        getHeadingColumnClass(_column) {
            if (_column.sortFunc) {
                return `sortable ${_column.sortDir || ''}`;
            }

            return '';
        },

        /**
         * Get column by its css class.
         *
         * @param {string} _class
         * @return {object}
         */
        getColumnByClass(_class) {
            const match = this.colClassRE.exec(_class);
            let column = null;

            if (match && match.length === 2) {
                column = this.columns[parseInt(match[1])] || null;
            }

            return column;
        },

        /**
         * Get data item value.
         *
         * @param {object} _item
         * @param {object} _col
         * @return {*}
         */
        getItemPropValue(_item, _col) {
            let value;

            if (_col.itemProp) {
                value = getNestedProp(_item, _col.itemProp);
            } else if (_col.readValueFrom) {
                value = _item[_col.readValueFrom];
            } else {
                value = _item[_col.name];
            }

            if (_col.formatter && !_col.hidden) {
                value = _col.formatter(value, _item);
            }

            return value;
        },

        /**
         * Sort table by column.
         *
         * @param {Object} _column
         * @param {String} [_sortDir] 'asc'|'desc'
         */
        sortByColumn(_column, _sortDir) {
            if (_column && _column.sortFunc) {
                const sortByCol = this._sortByCol;

                if (sortByCol > -1 && sortByCol !== _column._index) {
                    this.columns[sortByCol].sortDir = '';
                }

                if (_sortDir) {
                    _column.sortDir = _sortDir;
                } else {
                    // default sort on column header click is 'desc'
                    if (_column.sortDir === 'desc') {
                        _column.sortDir = 'asc';
                    } else {
                        _column.sortDir = 'desc';
                    }
                }

                this._sortByCol = _column._index;

                this.items.sort(_column.sortFunc(_column.itemProp || _column.name, _column.sortDir));
            }
        },

        /**
         * @param {Event} _event
         */
        onTableClick(_event) {
            /** @type {HTMLElement} */
            let elem;

            if (this.actionOnRow) {
                elem = _event.target.closest('[data-dt-item-id]');
                if (elem) {
                    const id = elem.getAttribute('data-dt-item-id');
                    const item = this.items.find((_item) => _item.id === id);

                    if (item) {
                        this.$emit('row-action', { ...item });
                    }
                }
            }
        },

        /**
         * @param {KeyboardEvent} _event
         */
        onTabletKeyup(_event) {
            if (isAriaAction(_event)) {
                this.onTableClick(_event);
            }
        },

        /**
         * @param {Event} _event
         */
        onHeaderClick(_event) {
            let elem = _event.target.closest('th');
            const column = elem ? this.getColumnByClass(elem.className) : null;

            this.sortByColumn(column);
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
        obj2css: obj2css,
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
