<template>
    <div class="f-crypto-symbol">
        <span class="img" :style="{ width: imgWidth, height: imgHeight }">
            <icon v-if="svgIcon" :data="svgIcon" original />
            <img v-else-if="token.logoUrl" :src="token.logoUrl" class="not-fluid" :alt="$defi.getTokenSymbol(token)" />
        </span>
        <span>{{ $defi.getTokenSymbol(token) }}</span>
    </div>
</template>

<script>
import ftmIcon from '../../../assets/svg/tokens/FTM.svg';
import wftmIcon from '../../../assets/svg/tokens/wFTM.svg';
import fusdIcon from '../../../assets/svg/tokens/fUSD.svg';

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

    computed: {
        svgIcon() {
            const { token } = this;

            if (token) {
                switch (token.symbol) {
                    case 'FTM':
                        return ftmIcon;
                    case 'WFTM':
                        return wftmIcon;
                    case 'FUSD':
                        return fusdIcon;
                }
            }

            return null;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
