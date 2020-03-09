import Vue from 'vue';

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
