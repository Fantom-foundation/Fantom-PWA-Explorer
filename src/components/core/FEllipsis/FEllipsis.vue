<template>
    <span class="f-ellipsis" :class="cssClass">
        <span><slot name="prefix"></slot></span>

        <template v-if="overflow === 'middle'">
            <span class="left-chars">{{ leftChars }} </span>
            <span class="right-chars">{{ rightChars }} </span>
        </template>
        <template v-else>
            {{ cText }}
        </template>

        <span><slot name="suffix"></slot></span>
    </span>
</template>

<script>
/**
 * Renders ellipsis (using css text-overflow property) at the start, at the middle or at the end of the given text.
 */
export default {
    name: 'FEllipsis',

    props: {
        text: {
            type: String,
            default: '',
            required: true,
        },
        /**
         * Position of three dots.
         *
         * @type {('start' | 'middle' | 'end')}
         */
        overflow: {
            type: String,
            default: 'end',
            validator: function (_value) {
                return ['start', 'middle', 'end'].indexOf(_value) !== -1;
            },
        },
        /** Number of fixed characters (at the start or at the end), if `overflow` is set to `'middle'`. */
        fixedCharsCount: {
            type: Number,
            default: 5,
            validator(_value) {
                return _value > 0;
            },
        },
        /**
         * Position of fixed characters, if `overflow` is set to `'middle'`.
         *
         * @type {('start' | 'end')}
         */
        fixedCharsPos: {
            type: String,
            default: 'end',
            validator(_value) {
                return ['start', 'end'].indexOf(_value) !== -1;
            },
        },
        /**
         * Align text to the right.
         */
        alignRight: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        cText() {
            return this.text;
        },

        /**
         * Get left part of text.
         */
        leftChars() {
            const { cText } = this;

            if (this.fixedCharsPos === 'end') {
                return cText.substring(0, cText.length - this.fixedCharsCount);
            }

            return cText.substring(0, this.fixedCharsCount);
        },

        /**
         * Get right part of text.
         */
        rightChars() {
            const { cText } = this;

            if (this.fixedCharsPos === 'end') {
                return cText.substring(cText.length - this.fixedCharsCount);
            }

            return cText.substring(this.fixedCharsCount);
        },

        cssClass() {
            return [
                `overflow-${this.overflow}`,
                {
                    'fixed-char-pos-start': this.fixedCharsPos === 'start',
                    'f-ellipsis-align-right': this.alignRight,
                },
            ];
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
