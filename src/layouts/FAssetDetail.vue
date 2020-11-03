<template>
    <div class="f-asset-detail f-data-layout">
        <f-card>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_assets.symbol') }}</div>
                <div class="col"><f-crypto-symbol :token="token" /></div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_assets.name') }}</div>
                <div class="col">{{ token.name }}</div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_assets.contract') }}</div>
                <div class="col">
                    <router-link :to="{name: 'address-detail', params: {id: token.address}}" :title="token.address">
                        <f-ellipsis :text="token.address" overflow="middle" />
                    </router-link>
                </div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_assets.total_supply') }}</div>
                <div class="col">
                    {{ formatNumberByLocale($defi.fromTokenValue(token.totalSupply, token).toFixed(0), 0) }}
                </div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_assets.price') }}</div>
                <div class="col">
                    $ {{ formatNumberByLocale($defi.fromTokenValue(token.price, token), $defi.getTokenDecimals(token)) }}
                </div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t('view_assets.decimals') }}</div>
                <div class="col">{{ token.decimals }}</div>
            </div>
        </f-card>
    </div>
</template>

<script>
import FEllipsis from "@/components/core/FEllipsis/FEllipsis.vue";
import FCard from "@/components/core/FCard/FCard.vue";
import FCryptoSymbol from "@/components/core/FCryptoSymbol/FCryptoSymbol.vue";
import {formatNumberByLocale} from "@/filters.js";

export default {
    name: "FAssetDetail",
    components: {FCryptoSymbol, FCard, FEllipsis},
    props: {
        /** Token address */
        address: {
            type: String,
            required: true,
            default: ''
        }
    },

    data() {
        return {
            /** @type {DefiToken} */
            token: {},
        };
    },

    created() {
        this.init();
    },

    methods: {
        async init() {
            const { $defi } = this;
            const result = await Promise.all([
                $defi.fetchTokens(),
                $defi.init(),
            ]);

            const token = result[0].filter((_item) => _item.address === this.address);

            if (token) {
                this.token = token[0];
            }
        },

        formatNumberByLocale,
    },
}
</script>

<style scoped>

</style>
