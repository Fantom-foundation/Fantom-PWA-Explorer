import Vue from 'vue';

Vue.filter('formatDate', function (_value) {
    if (_value) {
        // TODO: use i18n current locale
        return new Date(_value).toLocaleDateString('en-GB', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
});
