import Vue from 'vue';
import web3utils from 'web3-utils';

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
 * @return {string}
 */
export function formatDate(_value) {
    if (!_value) {
        return '';
    }

    const date = (_value instanceof Date ? _value : new Date(_value));

    // TODO: use i18n current locale
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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
Vue.filter('formatHash', formatHash);
Vue.filter('formatHexToInt', formatHexToInt);
