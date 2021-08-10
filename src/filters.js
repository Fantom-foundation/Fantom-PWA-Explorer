import Vue from 'vue';
import web3utils from 'web3-utils';
const appConfig = require('../app.config.js');

const zeroString = '00000000';
const downtimeThreshold = appConfig.downtimeThreshold;

/**
 * @param {string|number} _timestamp
 * @return {int}
 */
export function prepareTimestamp(_timestamp) {
    if (!_timestamp) {
        return 0;
    }

    let timestamp = _timestamp;

    if (web3utils.isHexStrict(_timestamp)) {
        timestamp = formatHexToInt(_timestamp);
    }

    if (timestamp >= 1e16 || timestamp <= -1e16) {
        timestamp = Math.floor(timestamp / 1000000);
    } else if (timestamp >= 1e14 || timestamp <= -1e14) {
        timestamp /= 1000;
    } else {
        timestamp *= 1000;
    }

    return timestamp;
}


/**
 * @param {string|number} _number
 * @param {int} _digits
 * @return {string}
 */
export function addZeros(_number, _digits) {
    // TODO: use i18n current locale
    const parts =(new Intl.NumberFormat('en-GB')).formatToParts(_number);
    let number = _number;

    if (parts.length < 2) {
        // number = `${number}.${zeroString.slice(0, _digits)}`;
        number = `${parts[0].value}.${zeroString.slice(0, _digits)}`;
    } else if (parts[parts.length - 2].type !== 'decimal') {
        number = `${parts.map(_item => _item.value).join('')}.${zeroString.slice(0, _digits)}`;
    } else {
        const len = parts[parts.length - 1].value.length;
        number = `${parts.map(_item => _item.value).join('')}${len < _digits ? `${zeroString.slice(0, _digits - len)}`  : ''}`;
    }

    return number;
}

/**
 * @param {string|number} _timestamp
 * @return {Date|''}
 */
export function timestampToDate(_timestamp) {
    const timestamp = prepareTimestamp(_timestamp);

    if (!timestamp) {
        return '';
    }

    return new Date(timestamp);
}

/**
 * @param {Date} _date
 * @returns {null|Date}
 */
function dateToUTCDate(_date) {
    if (_date instanceof Date) {
        return new Date(_date.getTime() - _date.getTimezoneOffset() * 60000);
    }

    return null;
}

/**
 * @param {string|Date} _value
 * @param {boolean} [_notWeekday]
 * @param {boolean} [_notTime]
 * @return {string}
 */
export function formatDate(_value, _notWeekday, _notTime) {
    if (!_value) {
        return '';
    }

    const date = (_value instanceof Date ? _value : new Date(_value));
    const utcDate = dateToUTCDate(date);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    if (!_notTime) {
        options.timeZoneName = 'short';
    }

    if (!_notWeekday) {
        // options.weekday = 'short';
    }

    if (!_notTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    // TODO: use i18n current locale
    return utcDate !== null && utcDate.getTime() === 0
        ? '-'
        : date.toLocaleDateString('en-US', options);
}

/**
 * @param {string|number} _value
 * @return {string}
 */
export function formatDuration(_value) {
    if (!_value) {
        return '';
    }

    let timestamp = _value;

    if (web3utils.isHexStrict(_value)) {
        timestamp = formatHexToInt(_value);
    }


    if (timestamp) {
        return `${parseInt(timestamp / 3600) % 60}h ${parseInt(timestamp / 60) % 60}m ${timestamp % 60}s`;
    }

    return '';
}

/**
 * @param {number} _number
 * @param {number} [_digits]
 * @return {*}
 */
/*
export function formatNumberByLocale(_number, _digits = 0, _maximumDigits) {
    // TODO: use i18n current locale
    return (new Intl.NumberFormat('en-GB', { minimumFractionDigits: _digits, maximumFractionDigits: _maximumDigits })).format(_number);
}
*/
/**
 * @param {number} _number
 * @param {number} [_fractionDigits]
 * @param {string} [_currency]
 * @param {boolean} [_variableFDigits]
 * @return {*}
 */
export function formatNumberByLocale(
    _number,
    _fractionDigits = 2,
    _currency,
    _variableFDigits
) {
    let options = {
        minimumFractionDigits: _variableFDigits ? 0 : _fractionDigits,
        maximumFractionDigits: _fractionDigits,
    };

    if (_currency) {
        options.style = 'currency';
        options.currency = _currency;
    }

    return new Intl.NumberFormat('en-US', options).format(_number);
}


/**
 * @param {string} _value
 * @return {string}
 */
export function formatHash(_value) {
    if (!_value) {
        return '';
    }

    const leftChars = 8;
    const rightChars = 6;

    if (_value.length > (leftChars + rightChars + 3)) {
        return `${_value.slice(0, leftChars)} ... ${_value.slice(-rightChars)}`;
    }

    return _value;
}

/**
 * @param {string} _value
 * @return {int}
 */
export function formatHexToInt(_value) {
    if (!_value) {
        return '';
    }

    // return web3utils.toBN(_value);
    return parseInt(_value, 16);
}

/**
 * @param {string|number} _value*
 * @param {int} _digits
 * @return {string}
 */
export function numToFixed(_value, _digits) {
    let value = _value;

    if (web3utils.isHexStrict(_value)) {
        value = formatHexToInt(_value);
    }

    return Number.parseFloat(value).toFixed(_digits);
}

/**
 * @param {number} _downtime
 * @return {number}
 */
export function clampDowntime(_downtime) {
    return _downtime < downtimeThreshold ? 0 : _downtime;
}

Vue.filter('formatDate', formatDate);
Vue.filter('formatDuration', formatDuration);
Vue.filter('formatHash', formatHash);
Vue.filter('formatHexToInt', formatHexToInt);
