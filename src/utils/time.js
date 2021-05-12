import dayjs from 'dayjs';

const tRE = /(\d+)([dwmy])/;

/**
 * @param {string} _code Value + (d|w|m|y)
 * @returns {{unit: string, value: number}|null}
 */
export function parseTimeCode(_code) {
    const match = tRE.exec(_code ? _code.toLowerCase() : '');

    if (match && match.length === 3) {
        return {
            value: parseInt(match[1]),
            unit: match[2],
        };
    }

    return null;
}

export function getDayjsUnitByShortcut(_unit) {
    let djsUnit = '';

    if (_unit === 'w') {
        djsUnit = 'week';
    } else if (_unit === 'd') {
        djsUnit = 'day';
    } else if (_unit === 'm') {
        djsUnit = 'month';
    } else if (_unit === 'y') {
        djsUnit = 'year';
    }

    return djsUnit;
}

/**
 * Get time span in unix timestamp.
 *
 * @param {string} _code Value + (d|w|m|y)
 * @param {*} [_ends] Dayjs
 * @param {boolean} [_utc]
 * @returns {(number|number)[]}
 */
export function getTimeSpan(_code, _ends, _utc = true) {
    const timeCode = parseTimeCode(_code);
    let startDateTS = 0;
    const endDate = _utc ? dayjs.utc(_ends) : dayjs(_ends);

    if (timeCode) {
        if (timeCode.unit === 'w') {
            startDateTS = endDate.subtract(timeCode.value, 'week').startOf('day').unix();
        } else if (timeCode.unit === 'm') {
            startDateTS = endDate.subtract(timeCode.value, 'month').startOf('day').unix();
        } else if (timeCode.unit === 'y') {
            startDateTS = endDate.subtract(timeCode.value, 'year').startOf('day').unix();
        }
    }

    return [startDateTS, endDate.unix()];
}

/**
 * @return {dayjs.Dayjs}
 */
export function nowDJS() {
    return dayjs();
}
