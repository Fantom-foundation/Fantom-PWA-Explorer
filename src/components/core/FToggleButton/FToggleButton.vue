<template>
    <label class="toggle-btn" :class="sizeClass">
        <!--<input type="checkbox" class="toggle-btn__input" v-bind="checkboxProps" />-->
        <input type="checkbox" class="toggle-btn__input" v-bind="checkboxProps" @change="onChange" />
        <span class="toggle-btn__btn"></span>
        <span class="toggle-btn__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
    <!--
    <label class="option">
        <input type="checkbox" v-bind="checkboxProps" @change="onChange" />
        <span class="checkbox"></span> <slot>{{ label }}</slot>
    </label>
    -->
</template>

<script>
import { checkboxMixin } from '@/mixins/checkbox.js';

export default {
    name: 'FToggleButton',

    mixins: [checkboxMixin],

    model: {
        prop: 'checked',
        event: 'change',
    },

    props: {
        /**
         * Position of three dots.
         *
         * @type {('start' | 'middle' | 'end')}
         */
        size: {
            type: String,
            default: 'md',
            validator: function (_value) {
                return ['xs', 'sm', 'md', 'lg'].indexOf(_value) !== -1;
            },
        },
    },

    computed: {
        sizeClass() {
            return `toggle-btn--${this.size}`;
        },
    },

    methods: {
        onChange(_event) {
            this.$emit('change', _event.target.checked);
        },
    },
};
</script>
