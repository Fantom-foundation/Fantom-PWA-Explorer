<template>
    <div class="f-lightweight-chart">
        <slot name="top"></slot>
        <div ref="chartContainer" class="f-lightweight-chart__container"></div>
        <slot name="bottom"></slot>
    </div>
</template>

<script>
import { createChart } from 'lightweight-charts';
import { isArray, throttle } from '../../../utils';

const WEI = 1000000000000000000;

/**
 * Lightweight chart series object.
 * @typedef {Object} LightweightSeries
 * @property {array} series Data for series.
 * @property {('line' | 'histogram' | 'area' | 'bar' | 'candlestick')} seriesType Type of series.
 * @property {('' | 'to-eth')} [transformValues]
 */

/**
 * Lightweight charts wrapper.
 * https://www.tradingview.com/lightweight-charts/
 */
export default {
    name: 'FLightweightCharts',

    props: {
        /**
         * Data for chart.
         * It can be series (array of series data) or object, where keys are unique series ids and values are objects
         * of type LightweightSeries.
         * @type {[] | {key: string, series: LightweightSeries}}
         */
        series: {
            type: [Array, Object],
            default() {
                return [];
            },
        },
        /**
         * Type of series.
         * @type {('line' | 'histogram' | 'area' | 'bar' | 'candlestick')}
         */
        seriesType: {
            type: String,
            default: 'line',
            validator: function (_value) {
                return ['line', 'histogram', 'area', 'bar', 'candlestick'].indexOf(_value) !== -1;
            },
        },
        /** Lightweight chart's options. */
        options: {
            type: Object,
            default() {
                return {};
            },
        },
        /** Lightweight chart's series options. */
        seriesOptions: {
            type: Object,
            default() {
                return {};
            },
        },
        /** Chart height. */
        height: {
            type: Number,
            default: 300,
        },
        /** Basic line color. */
        color: {
            type: String,
            default: '#286FF6',
        },
        /** Default scale top margin */
        scaleMarginTop: {
            type: Number,
            default: 0.1,
        },
        /** Default scale bottom margin */
        scaleMarginBottom: {
            type: Number,
            default: 0.03,
        },
        /**
         * @type {('' | 'to-eth')}
         */
        transformValues: {
            type: String,
            default: '',
            validator: function (_value) {
                return ['', 'to-eth'].indexOf(_value) !== -1;
            },
        },
        /** Inject missing values */
        addMissingValues: {
            type: Object,
            default() {
                return {
                    timeResolution: 0,
                    value: 0,
                };
            },
        },
        /**
         * Transform given series time to timestamp.
         */
        timeToTimestamp: {
            type: Boolean,
            default: false,
        },
        /**  */
        fitContent: {
            type: Boolean,
            default: false,
        },
        /** Disable auto resizing. */
        noAutoResize: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            dSeries: [],
            chartOptions: {},
        };
    },

    computed: {
        cSeries() {
            const { series } = this;
            let data = {};

            if (isArray(series)) {
                data.series = {
                    seriesType: this.seriesType,
                    seriesOptions: this.seriesOptions,
                    transformValues: this.transformValues,
                    timeToTimestamp: this.timeToTimestamp,
                    addMissingValues: this.addMissingValues,
                    series: series,
                };
            }

            if (!data.series) {
                data = { ...series };
            }

            Object.keys(data).forEach((_seriesKey) => {
                const item = data[_seriesKey];

                if (item.timeToTimestamp || item.addMissingValues.timeResolution > 0) {
                    this.transformTimeToTimestamp(item.series);
                }

                if (item.addMissingValues.timeResolution > 0) {
                    item.series = this.injectMissingValues(item.series, item.addMissingValues);
                }

                if (item.transformValues) {
                    if (item.transformValues === 'to-eth') {
                        item.series = this.transformValuesToEth(item.series);
                    }
                }
            });

            return data;
        },
    },

    watch: {
        series() {
            this.initChart();
            // this.initSeries();
        },
    },

    created() {
        /** Lightweight chart instance. */
        this._chart = null;
        /** Array of Lightweight chart series instances. */
        this._series = {};
        /** Debounce function used as window resize callback. */
        this._resizeCallback = throttle((_event) => this.onWindowResize(_event), 300, true);
    },

    mounted() {
        // this.initChart();

        if (!this.noAutoResize) {
            window.addEventListener('resize', this._resizeCallback, false);
        }
    },

    beforeDestroy() {
        this.destroyChart();

        if (!this.noAutoResize) {
            window.removeEventListener('resize', this._resizeCallback);
        }
    },

    methods: {
        initChart() {
            const defaultOptions = {
                height: this.height,
                priceScale: {},
            };

            this.destroyChart();

            this.chartOptions = {
                ...defaultOptions,
                ...this.options,
            };

            if (!this.chartOptions.priceScale.scaleMargins) {
                this.chartOptions.priceScale.scaleMargins = {
                    top: this.scaleMarginTop,
                    bottom: this.scaleMarginBottom,
                };
            }

            this._chart = createChart(this.$refs.chartContainer, this.chartOptions);

            this.initSeries();
        },

        initSeries() {
            this._series = {};

            Object.keys(this.cSeries).forEach((_seriesKey) => {
                this.addSeries(_seriesKey);
            });

            this.updateColors();

            if (this.fitContent) {
                this._chart.timeScale().fitContent();
            }
        },

        addSeries(_seriesKey) {
            const chart = this._chart;
            const seriesObj = this.cSeries[_seriesKey];

            if (!chart || !seriesObj) {
                return;
            }

            const defaultSeriesOptions = {
                // color: this.color,
            };
            const seriesOptions = {
                ...defaultSeriesOptions,
                ...seriesObj.seriesOptions,
            };
            let series = null;

            switch (seriesObj.seriesType) {
                case 'line':
                    series = chart.addLineSeries(seriesOptions);
                    break;
                case 'histogram':
                    series = chart.addHistogramSeries(seriesOptions);
                    break;
                case 'area':
                    series = chart.addAreaSeries(seriesOptions);
                    break;
                case 'bar':
                    series = chart.addBarSeries(seriesOptions);
                    break;
                case 'candlestick':
                    series = chart.addCandlestickSeries(seriesOptions);
                    break;
            }

            if (series) {
                series.setData(seriesObj.series);
                this._series[_seriesKey] = series;
            }
        },

        transformValuesToEth(_series) {
            let data = [];
            let item;

            if (_series) {
                for (let i = 0, len1 = _series.length; i < len1; i++) {
                    item = _series[i];

                    data.push({
                        ...item,
                        value: parseInt(item.value, 16) / WEI,
                    });
                }
            }

            return data;
        },

        transformTimeToTimestamp(_series) {
            let date;

            if (_series) {
                for (let i = 0, len1 = _series.length; i < len1; i++) {
                    date = new Date(_series[i].time);
                    _series[i].time = Math.floor(date.getTime() / 1000);
                }
            }
        },

        injectMissingValues(_series, _options) {
            let data = [];
            let prevItem;
            let item;
            let diff = 0;
            const { timeResolution } = _options;
            const { value } = _options;
            const useLastValue = value === 'last';

            if (_series && timeResolution > 0) {
                for (let i = 0, len1 = _series.length; i < len1; i++) {
                    item = _series[i];

                    if (i > 0) {
                        prevItem = _series[i - 1];
                        diff = item.time - prevItem.time;
                        if (diff > timeResolution) {
                            for (let j = 1, len2 = parseInt(diff / timeResolution); j < len2; j++) {
                                data.push({
                                    time: prevItem.time + j * timeResolution,
                                    value: useLastValue ? prevItem.value : value,
                                });
                            }
                        }
                    }

                    data.push({ ...item });
                }
            }

            return data;
        },

        updateColors() {
            const chartCP = this.getChartCustomProperties();
            const series = this._series;
            const { cSeries } = this;
            const { chartOptions } = this;
            const options = {
                grid: {},
                layout: {},
                timeScale: {},
                priceScale: {},
            };
            const grid = { ...chartOptions.grid };
            const layout = { ...chartOptions.layout };
            const timeScale = { ...chartOptions.timeScale };
            const priceScale = { ...chartOptions.priceScale };

            if (chartCP.vertLinesColor && (!grid.vertLines || !grid.vertLines.color)) {
                options.grid.vertLines = { ...grid.vertLines, color: chartCP.vertLinesColor };
            }

            if (chartCP.horzLinesColor && (!grid.horzLines || !grid.horzLines.color)) {
                options.grid.horzLines = { ...grid.horzLines, color: chartCP.horzLinesColor };
            }

            ['backgroundColor', 'textColor', 'fontSize', 'fontFamily'].forEach((_prop) => {
                if (chartCP[_prop] && !layout[_prop]) {
                    options.layout[_prop] = _prop === 'fontSize' ? parseInt(chartCP[_prop]) : chartCP[_prop];
                }
            });

            if (chartCP.timeScaleBorderColor && !timeScale.borderColor) {
                options.timeScale.borderColor = chartCP.timeScaleBorderColor;
            }

            if (chartCP.priceScaleBorderColor && !priceScale.borderColor) {
                options.priceScale.borderColor = chartCP.priceScaleBorderColor;
            }

            this._chart.applyOptions(options);

            Object.keys(series).forEach((_seriesKey) => {
                const item = cSeries[_seriesKey];
                const seriesOptions = { ...item.seriesOptions };

                if (!item) {
                    return;
                }

                if (chartCP.lineColor && (!seriesOptions || !seriesOptions.color)) {
                    series[_seriesKey].applyOptions({
                        color: chartCP.lineColor,
                        lineColor: chartCP.lineColor,
                        topColor: chartCP.topColor,
                        bottomColor: chartCP.bottomColor,
                        lineWidth: chartCP.lineWidth,
                    });
                }
            });
        },

        getChartCustomProperties() {
            const style = getComputedStyle(this.$el);
            const cp = {
                lineColor: style.getPropertyValue('--f-lightweight-chart-chart-line-color'),
                textColor: style.getPropertyValue('--f-lightweight-chart-chart-text-color'),
                topColor: style.getPropertyValue('--f-lightweight-chart-chart-top-color'),
                bottomColor: style.getPropertyValue('--f-lightweight-chart-chart-bottom-color'),
                lineWidth: style.getPropertyValue('--f-lightweight-chart-chart-line-width'),
                vertLinesColor: style.getPropertyValue('--f-lightweight-chart-chart-vert-lines-color'),
                horzLinesColor: style.getPropertyValue('--f-lightweight-chart-chart-horz-lines-color'),
                backgroundColor: style.getPropertyValue('--f-lightweight-chart-chart-background-color'),
                fontSize: style.getPropertyValue('--f-lightweight-chart-chart-font-size'),
                fontFamily: style.getPropertyValue('--f-lightweight-chart-chart-font-family'),
                timeScaleBorderColor: style.getPropertyValue('--f-lightweight-chart-chart-time-scale-border-color'),
                priceScaleBorderColor: style.getPropertyValue('--f-lightweight-chart-chart-price-scale-border-color'),
            };

            Object.keys(cp).forEach((_key) => {
                const color = cp[_key];

                if (color) {
                    cp[_key] = color.trim();
                } else {
                    delete cp[_key];
                }
            });

            return cp;
        },

        destroyChart() {
            if (this._chart) {
                this._series = {};
                this._chart.remove();
                this._chart = null;
            }
        },

        onWindowResize() {
            const chart = this._chart;

            if (chart) {
                chart.resize(this.$refs.chartContainer.clientWidth, this.height);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
