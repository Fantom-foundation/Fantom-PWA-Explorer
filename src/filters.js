import Vue from 'vue';
import web3utils from 'web3-utils';

const zeroString = '00000000';

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
 * @param {string|number} _value
 * @return {Date|null}
 */
export function timestampToDate(_value) {
    if (!_value) {
        return '';
    }

    let timestamp = _value;

    if (web3utils.isHexStrict(_value)) {
        timestamp = formatHexToInt(_value);
    }


    if (timestamp) {
        return new Date (timestamp * 1000);
    }

    return null;
}

/**
 * @param {string|Date} _value
 * @param {boolean} [_notWeekday]
 * @return {string}
 */
export function formatDate(_value, _notWeekday) {
    if (!_value) {
        return '';
    }

    const date = (_value instanceof Date ? _value : new Date(_value));
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    if (!_notWeekday) {
        options.weekday = 'short';
    }

    // TODO: use i18n current locale
    return date.toLocaleDateString('en-GB', options);
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
export function formatNumberByLocale(_number, _digits) {
    // TODO: use i18n current locale
    let number = (new Intl.NumberFormat('en-GB')).format(_number);

    if (_digits) {
        number = addZeros(_number, _digits);
    }

    return number;
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

Vue.filter('formatDate', formatDate);
Vue.filter('formatDuration', formatDuration);
Vue.filter('formatHash', formatHash);
Vue.filter('formatHexToInt', formatHexToInt);
