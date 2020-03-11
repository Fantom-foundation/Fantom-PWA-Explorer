import Vue from 'vue';
// import web3utils from 'web3-utils';
import web3utils from 'web3-utils';

/**
 * @param {string|number} _value
 * @return {int}
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

    return '';
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

Vue.filter('formatDate', function (_value) {
    if (!_value) {
        return '';
    }

    // TODO: use i18n current locale
    return new Date(_value).toLocaleDateString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

Vue.filter('formatHash', function (_value) {
    if (!_value) {
        return '';
    }

    const leftChars = 8;
    const rightChars = 6;

    if (_value.length > (leftChars + rightChars + 3)) {
        return `${_value.slice(0, leftChars)} ... ${_value.slice(-rightChars)}`;
    }

    return _value;
});

Vue.filter('formatHexToInt', formatHexToInt);
