<template>
<div class="dailyblocks">
    <div class="chart_label">
        <h2 class="h3">{{ $t('daily_blocks.label') }}</h2>
        <ChartResolutions :value="resolution" @change="onChartResolutionsChange" />
    </div>
    <FLightweightCharts
        :series="dailyBlocksSeries"
        series-type="area"
        __time-to-timestamp
        :fit-content="true"
        :height="280"
        :options="{ handleScroll: false,handleScale: false }"
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
    name: "DailyBlocks",

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
        this.loadDailyBlocks(getISODateByTimecode(this.resolution));
    },

    methods: {
        async loadDailyBlocks(from = null, to = null) {
            let dailyBlocks = await this.fetchDailyBlocks(from, to);

            dailyBlocks = dailyBlocks.map((item) => {
                return {
                    time: item.date.toString(),
                    value: item.blocksCount,
                };
            });

            this.dailyBlocksSeries = reverseSeries(dailyBlocks);
        },

        async fetchDailyBlocks(from = null, to = null) {
            const data = await this.$apollo.query({
                query: gql`
                    query DailyFeeFlow($from:Time, $to:Time) {
                        dailyFeeFlow(from: $from, to: $to) {
                            date
                            blocksCount
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
            this.loadDailyBlocks(getISODateByTimecode(value));
        }
    }
}
</script>

<style scoped>

</style>
