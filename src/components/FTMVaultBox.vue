<template>
    <FCard class="vaultbox">
        <h3 class="vaultbox_title">{{ title }}</h3>
        <p class="vaultbox_amount">
            <span class="number">{{ cAmount }}</span> <span class="vaultbox_amount_currency">FTM</span>
        </p>
        <p class="vaultbox_amount_usd number" data-testid="amount_usd">
            <FTMTokenValue :value="cAmountUSD" with-price-currency no-currency :decimals="0" />
        </p>
    </FCard>
</template>

<script>
import {formatNumberByLocale} from "@/filters.js";
import {bFromWei} from "@/utils/big-number.js";
import FTMTokenValue from "@/components/core/FTMTokenValue/FTMTokenValue.vue";
import FCard from "@/components/core/FCard/FCard.vue";

export default {
    name: "FTMVaultBox",
    components: {FCard, FTMTokenValue},

    props: {
        /** FTM amount, 18 decimals, hex number. */
        amount: {
            type: String,
            default: '0x0',
        },
        ftmPrice: {
            type: Number,
            default: 0,
        },
        title: {
            type: String,
            default: '',
        },
    },

    computed: {
        cAmount() {
            return formatNumberByLocale(bFromWei(this.amount).toNumber(), 0);
        },

        cAmountUSD() {
            return bFromWei(this.amount).multipliedBy(this.ftmPrice).toNumber();
        },
    }
}
</script>

<style lang="scss">
.vaultbox {
    --vaultbox-font-size: 20px;
    --vaultbox-background-color: #f9f9f9;

    text-align: center;
    //padding: var(--f-spacer-5) var(--f-spacer-7) var(--f-spacer-7) var(--f-spacer-7);
    display: flex;
    flex-direction: column;

    /*
    &.f-card {
        box-shadow: none;
        background: var(--vaultbox-background-color);
    }
    */

    h3 {
        font-size: var(--vaultbox-font-size);
        margin: 0;
        text-align: center;
    }

    &_amount {
        font-weight: 700;
        font-size: 44px;
        //padding: 54px 0 var(--f-spacer-5) 0;
        padding: 24px 0;

        &_currency {
            display: none;
            font-weight: normal;
            font-size: 0.5em;
        }

        &_usd {
            font-size: var(--vaultbox-font-size);
        }
    }
}

:root.dark-theme {
    .vaultbox {
        --vaultbox-background-color: var(--f-darker-color);
    }
}
</style>
