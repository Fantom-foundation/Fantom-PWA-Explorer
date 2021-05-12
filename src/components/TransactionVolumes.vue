<template>
    <div class="transactionvolumes">
        <f-lightweight-charts
            :series="txVolumeSeries"
            series-type="area"
            __time-to-timestamp
            :fit-content="true"
            :height="280"
            :options="{ handleScroll: false,handleScale: false }"
        />
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
import FLightweightCharts from "@/components/core/FLightweightCharts/FLightweightCharts.vue";
import dayjs from "dayjs";
import {getDayjsUnitByShortcut, parseTimeCode} from "@/utils/time.js";
import gql from "graphql-tag";

export default {
    name: "TransactionVolumes",

    components: {FLightweightCharts},

    props: {
        resolution: {
            type: String,
            default: '14d',
        }
    },

    data() {
        return {
            txVolumeSeries: [],
        }
    },

    watch: {
        resolution: {
            handler(_value) {
                this.loadTxVolumes(this.getateByTimecode(_value));
            },
            immediate: true,
        }
    },

    methods: {
        /**
         * @param {string} [_timeCode]
         * return {string} Date in `YYYY-MM-DD` format.
         */
        getateByTimecode(_timeCode = '1y') {
            const now = dayjs().utc();
            const timeCode = parseTimeCode(_timeCode);

            return now.subtract(timeCode.value, getDayjsUnitByShortcut(timeCode.unit)).format('YYYY-MM-DD');
        },

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

    }
}
</script>

<style scoped>

</style>
