<template>
    <div class="f-slider" :class="classes">
        <f-input ref="input" v-model="val" type="range" v-bind="fInputProps" no-input-style @input="onInput">
            <template #top="sProps">
                <slot name="top" v-bind="sProps"></slot>
            </template>
            <template #bottom="sProps">
                <slot name="bottom" v-bind="sProps">
                    <div v-if="labels.length" class="labels">
                        <div @click="onLabelsClick">
                            <template v-if="clickableLabels">
                                <button
                                    v-for="(item, index) in labels"
                                    :key="`btn${id}${index}`"
                                    class="no-style"
                                    type="button"
                                    :data-idx="index"
                                >
                                    <span>{{ item }}</span>
                                </button>
                            </template>
                            <template v-else>
                                <span v-for="(item, index) in labels" :key="`btn${id}${index}`">
                                    <span>{{ item }}</span>
                                </span>
                            </template>
                        </div>
                    </div>
                </slot>
            </template>
        </f-input>
    </div>
</template>

<script>
import FInput from '../FInput/FInput.vue';
import { inputMixin } from '../../../mixins/input.js';

/**
 * Accessible slider.
 * Wrapper around input[type="range"] field with fill bars.
 */
export default {
    name: 'FSlider',

    components: { FInput },

    mixins: [inputMixin],

    props: {
        ...FInput.props,
        /** Minimal value. */
        min: {
            type: String,
            default: '0',
        },
        /** Maximal value. */
        max: {
            type: String,
            default: '100',
        },
        /** Step. */
        step: {
            type: String,
            default: '1',
        },
        /** Use and display labels for range. */
        labels: {
            type: Array,
            default() {
                return [];
            },
            validator(_value) {
                return _value.length === 0 || _value.length >= 2;
            },
        },
        /** Clicking on label will set value. */
        clickableLabels: {
            type: Boolean,
            default: false,
        },
        /** Use fill bar from left corner to thumb. */
        useLowerFillBar: {
            type: Boolean,
            default: false,
        },
        /** Use fill bar from thumb to right corner. */
        useUpperFillBar: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            val: this.value,
        };
    },

    computed: {
        fInputProps() {
            return {
                ...FInput.computed.fInputProps.call(this),
            };
        },

        classes() {
            return {
                'use-lower-fill-bar': this.useLowerFillBar,
                'use-upper-fill-bar': this.useUpperFillBar,
            };
        },
    },

    watch: {
        value(_value) {
            this.val = this.getCorrectValue(_value);
            this.updateFills(this.val);
        },

        min() {
            this.updateFills(this.val);
        },

        max() {
            this.updateFills(this.val);
        },
    },

    /*
    created() {
        if (parseFloat(this.max) < parseFloat(this.min)) {
            console.error("'max' must be bigger than 'min'");
        }
    },
    */

    mounted() {
        const labelsLen = this.labels.length;

        if (labelsLen > 0) {
            this.$el.style.setProperty('--f-slider-labels-num', labelsLen);
        }

        this.updateFills();
    },

    methods: {
        /**
         * Update fill bars according to slider value.
         */
        updateFills(_value) {
            const dValue = this.getDetailedValue(_value);
            const inputStyle = this.$refs.input.$el.style;
            let sliderValue = 0;

            if (inputStyle.setProperty && (this.useLowerFillBar || this.useUpperFillBar)) {
                sliderValue = ((dValue.value - dValue.min) / (dValue.max - dValue.min)) * 100;

                if (isNaN(sliderValue)) {
                    sliderValue = 0;
                }

                // Set slider value in percentage to css custom property
                inputStyle.setProperty('--f-slider-value', sliderValue);
            }
        },

        /**
         * Get detailed slider value - current value, min value, ...
         *
         * @param {string|number} _value
         * @return {{min: number, max: number, step: number, value: number}}
         */
        getDetailedValue(_value) {
            return {
                value: parseFloat(_value !== undefined ? _value : this.$refs.input.$refs.input.value),
                min: parseFloat(this.min),
                max: parseFloat(this.max),
                step: parseFloat(this.step),
            };
        },

        /**
         *
         * @param {*} _value
         */
        getCorrectValue(_value) {
            const dValue = this.getDetailedValue(_value);

            if (isNaN(dValue.value)) {
                dValue.value = dValue.min;
            } else {
                // Clamp value
                dValue.value = Math.min(Math.max(dValue.value, dValue.min), dValue.max);
            }

            return dValue.value.toString();
        },

        /**
         * Set slider value by label button index.
         *
         * @param {number} _buttonIdx Button index.
         */
        setValueByLabelButton(_buttonIdx) {
            const labelsLen = this.labels.length;
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            let r;

            if (_buttonIdx >= 0 && _buttonIdx < labelsLen) {
                r = _buttonIdx * (1 / (labelsLen - 1));
                this.val = (min + r * (max - min)).toString();
                this.onInput(this.val);
            }
        },

        onLabelsClick(_event) {
            const eBtn = _event.target.closest('button');

            if (eBtn) {
                this.setValueByLabelButton(parseInt(eBtn.getAttribute('data-idx')));
            }
        },

        onInput(_value) {
            this.updateFills(_value);

            this.$emit('input', _value);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
