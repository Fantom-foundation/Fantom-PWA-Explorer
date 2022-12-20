<template>
    <div class="dailyfees">
        <div class="chart_label">
            <h2 class="h3">{{ $t('daily_fees.label') }}</h2>
            <ChartResolutions :value="resolution" @change="onChartResolutionsChange" />
        </div>
        <FLightweightCharts
            :series="dailyBlocksSeries"
            series-type="area"
            :fit-content="true"
            :height="280"
            :options="{ handleScroll: false,handleScale: false }"
            :series-options="{ priceLineVisible: false, priceFormat: { type: 'price', precision: 0, minMove: 1 } }"
        />
    </div>
</template>

<script>
import ChartResolutions from "@/components/ChartResolutions.vue";
import FLightweightCharts from "@/components/core/FLightweightCharts/FLightweightCharts.vue";
import gql from "graphql-tag";
import {getISODateByTimecode} from "@/utils/time.js";
import {reverseSeries} from "@/utils/chart.js";

export default {
    name: "DailyTxFees",

    components: {FLightweightCharts, ChartResolutions},

    props: {
        /** Default resolution */
        resolution: {
            type: String,
            default: '14d'
        }
    },

    data() {
        return {
            dailyBlocksSeries: []
        }
    },

    mounted() {
        this.loadDailyTxFees(getISODateByTimecode(this.resolution));
    },

    methods: {
        async loadDailyTxFees(from = null, to = null) {
            let dailyBlocks = await this.fetchDailyTxFees(from, to);

            dailyBlocks = dailyBlocks.map((item) => {
                return {
                    time: item.date.toString(),
                    value: item.feeFTM,
                };
            });

            this.dailyBlocksSeries = reverseSeries(dailyBlocks);
        },

        async fetchDailyTxFees(from = null, to = null) {
            const data = await this.$apollo.query({
                query: gql`
                    query DailyFeeFlow($from:Time, $to:Time) {
                        dailyFeeFlow(from: $from, to: $to) {
                            date
                            feeFTM
                        }
                    }
                `,
                variables: {
                    from: from,
                    to: to,
                },
                fetchPolicy: 'network-only',
            });

            return data.data.dailyFeeFlow || [];
        },

        onChartResolutionsChange(value) {
            this.loadDailyTxFees(getISODateByTimecode(value));
        }
    }
}
</script>

<style scoped>

</style>
