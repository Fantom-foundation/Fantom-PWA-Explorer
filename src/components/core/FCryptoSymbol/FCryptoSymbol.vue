<template>
    <div class="f-crypto-symbol">
        <span class="img" :style="{ width: imgWidth, height: imgHeight }">
            <img v-if="token.logoUrl" :src="token.logoUrl" class="not-fluid" :alt="$defi.getTokenSymbol(token)" />
        </span>
        {{ $defi.getTokenSymbol(token) }}
    </div>
</template>

<script>
/**
 * Render crypto logo and name by given token.
 * Requires vue defi plugin ($defi).
 */
export default {
    name: 'FCryptoSymbol',

    props: {
        /** @type {DefiToken} */
        token: {
            type: Object,
            default() {
                return null;
            },
            required: true,
        },
        imgWidth: {
            type: String,
            default: '40px',
        },
        imgHeight: {
            type: String,
            default: '40px',
        },
    },

    data() {
        return {
            logoUrl: this.token ? this.token.logoUrl : '',
        };
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
