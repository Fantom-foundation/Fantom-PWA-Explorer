<template>
    <div :id="id" class="flistbox" :class="classes">
        <slot name="top" v-bind="slotProps">
            <f-label v-if="label" :id="labeledById" :label="label" />
        </slot>
        <ul
            ref="listbox"
            role="listbox"
            class="flistbox_list no-markers"
            :tabindex="disabled ? -1 : 0"
            :aria-activedescendant="focusedItem.id"
            :aria-labelledby="ariaLabeledByIds"
            :aria-describedby="ariaDescribedByIds"
            :aria-disabled="disabled"
            :aria-invalid="validationState.invalid"
            @click="onClick"
            @mousedown.prevent
            @keydown="onKeydown"
            @keyup="onKeyup"
            @focus="onFocus"
        >
            <li
                v-for="item in items"
                :id="item.id"
                :key="item.id"
                role="option"
                :aria-selected="item.id === focusedItem.id"
                :aria-disabled="!!item.disabled"
                class="flistbox_list_item"
            >
                <slot :item="item"> {{ item.label }} </slot>
            </li>
        </ul>
        <slot name="bottom" v-bind="slotProps">
            <div v-if="validationState.errors.length > 0" :id="errorMsgId" class="ferrormessages">
                <div
                    v-for="(msg, idx) in validationState.errors"
                    :key="`${errorMsgId}_${idx}_err`"
                    class="ferrormessages_message"
                >
                    {{ msg }}
                </div>
            </div>
            <div v-else-if="infoText" :id="infoTextId" class="finfotext">
                {{ infoText }}
            </div>
        </slot>
    </div>
</template>

<script>
import { helpersMixin } from '../../../mixins/helpers.js';
import { formInputMixin } from '../../../mixins/form-input.js';
import { cloneObject } from '../../../utils';
import { isKey, keyboardNavigation } from '../../../utils/aria.js';
import { selectMixin } from '../../../mixins/select.js';
import FLabel from '../FLabel/FLabel.vue';

/**
 * FListbox item.
 * @typedef {Object} FListboxItem
 * @property {string} [value] Specifies the value of listbox item
 * @property {string} [label] Specifies a label for an item
 * @property {boolean} [disabled] Specifies that an item should be disabled
 * @property {boolean} [selected] Specifies that an item should be pre-selected
 */

/**
 * Listbox component created according to WAI-ARIA rules and practices.
 *
 * @mixes selectMixin
 */
export default {
    name: 'FListbox',

    inheritAttrs: false,

    components: { FLabel },

    mixins: [selectMixin, formInputMixin, helpersMixin],

    model: {
        prop: 'value',
        event: 'change',
    },

    props: {
        /**
         * Listbox's items
         * @type {FListboxItem[]}
         */
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        /** If `true`, `component-change` event will be fired right on item focus (keyboard movement, click) */
        selectImmediately: {
            type: Boolean,
            default: false,
        },
        /** If `true`, first focusable item will be focused */
        focusItemOnFocus: {
            type: Boolean,
            default: false,
        },
        /** If `true`, keyboard navigation will be circular (last item -> first item, first item -> last item) */
        circularNavigation: {
            type: Boolean,
            default: false,
        },
        horizontal: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            items: [],
            focusedItem: {},
            selectableItemSelector: '.flistbox_list_item:not([aria-disabled="true"])',
        };
    },

    computed: {
        classes() {
            return {
                'flistbox-horizontal': this.horizontal,
            };
        },
    },

    watch: {
        value(_val) {
            this.inputValue = _val;

            if (this.focusedItem.value !== _val) {
                this.focusItem(_val, false, 'value');
            }
        },

        data: {
            handler(_value, _oldValue) {
                if (JSON.stringify(_value) !== JSON.stringify(_oldValue)) {
                    this.items = this.getItems();
                }
            },
            deep: true,
        },

        items() {
            this.setSelected();
        },
    },

    created() {
        this._firstKeyup = true;
        this.items = this.getItems();
    },

    methods: {
        getItems() {
            const items = cloneObject(this.data);

            this.setIds(items);

            return items;
        },

        /**
         * Select item by `_key`.
         *
         * @param {*} _value Item value.
         * @param {boolean} [_selectItem]
         * @param {string} [_key] Name of item key.
         */
        focusItem(_value, _selectItem, _key = 'id') {
            let item;

            if (_value !== undefined && !this.disabled) {
                item = this.items.find(_item => _item[_key] === _value);

                // if (item && item.id !== this.focusedItem.id) {
                if (item && !item.disabled) {
                    if (this.selectImmediately || _selectItem) {
                        this.emitChangeEvent(cloneObject(item), _selectItem ? 'click' : 'focus');
                    }

                    this.focusedItem = item;

                    this.scrollToFocusedItem();
                }
            }
        },

        focus() {
            const eListbox = this.$refs.listbox;

            if (eListbox && !this.disabled) {
                eListbox.focus();
            }
        },

        /**
         * Set selected item.
         */
        setSelected() {
            const { value } = this;
            let selectedItem = this.items.find(_item => !!_item.selected);

            if (!selectedItem && value) {
                selectedItem = this.items.find(_item => _item.value === value);
            }

            this.focusedItem = {};

            if (selectedItem) {
                this.$nextTick(() => {
                    this.focusItem(selectedItem.id);
                    // this.focusItem(selectedItem.id, true);
                });
            }
        },

        scrollToFocusedItem() {
            const id = this.focusedItem.id;
            const { $el } = this;
            const listboxHeight = $el.clientHeight;
            let eItem;

            if (id && $el.scrollHeight > listboxHeight) {
                eItem = document.getElementById(id);
                if (eItem) {
                    const listboxScrollTop = $el.scrollTop;
                    const eItemOffsetTop = eItem.offsetTop;
                    const eItemBottom = eItemOffsetTop + eItem.offsetHeight;

                    if (eItemBottom > listboxScrollTop + listboxHeight) {
                        $el.scrollTop = eItemBottom - listboxHeight;
                    } else if (eItemOffsetTop < listboxScrollTop) {
                        $el.scrollTop = eItemOffsetTop;
                    }
                }
            }
        },

        /**
         * @param {FListboxItem} _item
         * @param {string} [_selectionAction]
         */
        emitChangeEvent(_item, _selectionAction = 'focus') {
            if (this.disabled) {
                return;
            }

            this.inputValue = _item.value || '';

            this.$emit('component-change', _item, _selectionAction);
            this.$emit('change', this.inputValue);

            if (this.validateOnChange) {
                this.validate();
            }
        },

        /**
         * Focus first focusable item.
         */
        focusFirstItem() {
            if (this.disabled) {
                return;
            }

            const item = this.items.find(_item => !_item.disabled);

            if (item) {
                this.focusedItem = item;
            }
        },

        /**
         * @param {Event} _event
         */
        onClick(_event) {
            if (this.disabled) {
                return;
            }

            const eItem = _event.target.closest(this.selectableItemSelector);

            if (eItem) {
                this.focusItem(eItem.id, true);
            }
        },

        /**
         * @param {KeyboardEvent} _event
         */
        onKeydown(_event) {
            if (this.disabled) {
                return;
            }

            let eItem = keyboardNavigation({
                _event,
                _selector: this.selectableItemSelector,
                _direction: 'both',
                _circular: this.circularNavigation,
                _target: document.getElementById(this.focusedItem.id),
                _focusElem: false,
            });

            if (!eItem && !this.focusedItem.id && (isKey('ArrowDown', _event) || isKey('ArrowUp', _event))) {
                this.focusFirstItem();
                eItem = document.getElementById(this.focusedItem.id);
            }

            if (eItem) {
                _event.preventDefault();
                this.focusItem(eItem.id);
            }
        },

        /**
         * @param {KeyboardEvent} _event
         */
        onKeyup(_event) {
            if (this.disabled) {
                return;
            }

            // if (!this.selectImmediately && this.focusedItem.id && isKey('Enter', _event) && !this._firstKeyup) {
            if (this.focusedItem.id && isKey('Enter', _event) && !this._firstKeyup) {
                this.emitChangeEvent(cloneObject(this.focusedItem), 'enterKey');
            }

            this._firstKeyup = false;
        },

        onFocus() {
            if (this.disabled) {
                return;
            }

            this._firstKeyup = true;

            if (this.focusItemOnFocus && !this.focusedItem.id) {
                if (this.value) {
                    this.focusItem(this.value, false, 'value');
                } else {
                    this.focusFirstItem();
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import "style";
</style>
