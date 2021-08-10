<template>
    <span class="f-token-value" :title="value">
        <f-placeholder
            v-if="usePlaceholder"
            :content-loaded="!!token.symbol || contentLoaded"
            :replacement-text="replacementText"
        >
            <span class="f-token-value__value">
                {{ tokenValue }}<span v-if="showDots" class="f-token-value__dots">&#8230;</span>
            </span>
            <span v-if="!noCurrency" class="currency">{{ tokenSymbol }}</span>
        </f-placeholder>
        <template v-else>
            <span class="f-token-value__value">
                {{ tokenValue }}<span v-if="showDots" class="f-token-value__dots">&#8230;</span>
            </span>
            <span v-if="!noCurrency" class="currency">{{ tokenSymbol }}</span>
        </template>
    </span>
</template>

<script>
import { formatNumberByLocale } from '@/filters.js';
import FPlaceholder from '@/components/core/FPlaceholder/FPlaceholder.vue';

export default {
    name: 'FTokenValue',

    components: { FPlaceholder },

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return {};
            },
            // required: true,
        },
        /** Token's value. */
        value: {
            type: [Number, String],
            default: 0,
        },
        /** Hide currency. */
        noCurrency: {
            type: Boolean,
            default: false,
        },
        /** Use FPlaceholder. */
        usePlaceholder: {
            type: Boolean,
            default: true,
        },
        /** Determines whether the content is loaded or not. */
        contentLoaded: {
            type: Boolean,
            default: false,
        },
        /** Replacement text for FPlaceholder. */
        replacementText: {
            type: String,
            default: '10,000.00 FTM',
        },
        /** Currency symbol used in `formatNumberByLocale` function */
        numberCurrency: {
            type: String,
            default: '',
        },
        /** Number of decimal places. If not set (-1), token decimal places will be taken. */
        decimals: {
            type: Number,
            default: -1,
        },
        maxDecimals: {
            type: Number,
            default: 0,
        },
        /** Add this number of decimals to default token decimals. */
        addDecimals: {
            type: Number,
            default: 0,
        },
    },

    computed: {
        tokenSymbol() {
            return this.$defi.getTokenSymbol(this.token);
        },

        tokenValue() {
            return this.formatTokenValue(this.value);
        },

        cDecimals() {
            const { maxDecimals } = this;
            const decimals =
                this.decimals > -1 ? this.decimals : this.$defi.getTokenDecimals(this.token) + this.addDecimals;

            return maxDecimals > 0 && decimals > maxDecimals ? maxDecimals : decimals;
        },

        showDots() {
            const { cDecimals } = this;

            if (cDecimals > 0) {
                const fValue = parseFloat(this.value);
                const tfValue = fValue.toFixed(cDecimals);
                const ftfValue = parseFloat(tfValue);

                if (fValue !== ftfValue) {
                    const spl = tfValue.split('.');

                    return spl.length === 2 && parseInt(spl[1]) === 0;
                }
            }

            return false;
        },
    },

    methods: {
        formatTokenValue(_value) {
            const { cDecimals } = this;

            return _value === 0
                ? 0
                : formatNumberByLocale(parseFloat(_value).toFixed(cDecimals), cDecimals, this.numberCurrency);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
