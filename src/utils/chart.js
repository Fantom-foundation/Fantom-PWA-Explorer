import dayjs from "dayjs";

/**
 * Reverse chart series if needed.
 * @param {array} series
 */
export function reverseSeries(series) {
    if (series.length > 1 && dayjs(series[0].time).isAfter(dayjs(series[1].time))) {
        series.reverse();
    }

    return series;
}
