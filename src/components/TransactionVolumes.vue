<template>
    <div class="transactionvolumes">
        <div class="chart_label">
            <h2 class="h3" id="transactionvolumes_l">{{ $t('transaction_volumes.label') }}</h2>
            <ChartResolutions :value="resolution" labeled-by="transactionvolumes_l" @change="onChartResolutionsChange" />
        </div>
        <FCard class="chart_card half-padding">
            <f-lightweight-charts
                :series="txVolumeSeries"
                series-type="area"
                __time-to-timestamp
                :fit-content="true"
                :height="280"
                :options="{ handleScroll: false,handleScale: false }"
                :series-options="{ priceLineVisible: false, priceFormat: { type: 'price', precision: 0, minMove: 1 } }"
            />
        </FCard>
        <!--                    <f-lightweight-charts
            ref="chart"
            :series="txVolumeSeries"
            series-type="histogram"
            :series-options="{ priceFormat: { type: 'volume' } }"
            __transform-values="to-eth"
            time-to-timestamp
            :height="280"
            :options="{handleScroll: true,handleScale: true }"
        />-->

    </div>
</template>

<script>
import ChartResolutions from "@/components/ChartResolutions.vue";
import FLightweightCharts from "@/components/core/FLightweightCharts/FLightweightCharts.vue";
import {getDateByTimecode} from "@/utils/time.js";
import gql from "graphql-tag";
import FCard from "@/components/core/FCard/FCard.vue";

export default {
    name: "TransactionVolumes",

    components: {FCard, ChartResolutions, FLightweightCharts},

    props: {
        /** Default resolution */
        resolution: {
            type: String,
            default: '14d'
        }
    },

    data() {
        return {
            txVolumeSeries: [],
        }
    },

    mounted() {
        setTimeout(() => {
            this.loadTxVolumes(getDateByTimecode(this.resolution));
        }, 1050);
    },

    methods: {
        async loadTxVolumes(_from = null, _to = null) {
            const txVolumes = await this.fetchTxVolumes(_from, _to);

            this.txVolumeSeries = txVolumes.map((_item) => {
                return {
                    time: _item.day,
                    value: _item.volume,
                };
            });
        },

        async fetchTxVolumes(_from = null, _to = null) {
            const data = await this.$apollo.query({
                query: gql`
                    query TxVolumes($from:String, $to:String) {
                        trxVolume(from: $from, to: $to) {
                            day
                            amount
                            volume
                        }
                    }
                `,
                variables: {
                    from: _from,
                    to: _to,
                },
                fetchPolicy: 'network-only',
            });

            return data.data.trxVolume || [];
        },

        onChartResolutionsChange(value) {
            this.loadTxVolumes(getDateByTimecode(value));
        }
    }
}
</script>

<style scoped>

</style>
