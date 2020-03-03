/**
 * @param {String} _eventName
 * @param {Object} [_data]
 * @param {HTMLElement} [_elem] `this` is default.
 * @return {Boolean} Returns `false` if event is cancelable and one of the event handlers canceled it (prevenDefault()).
 */
function dispatchCustomEvent(_eventName, _data, _elem) {
    const elem = _elem || document.body;

    return elem.dispatchEvent(
        new CustomEvent(_eventName, {
            detail: _data,
            cancelable: true,
            bubbles: true,
            composed: true
        }),
    );
}

export default {
    methods: {
        emitCustomEvent(_eventName, _data, _elem) {
            const elem = _elem || this.$el;

            // emit vue custom event as well
            this.$emit(_eventName, {detail: _data});

            return dispatchCustomEvent(_eventName, _data, elem);
        }
    }
}
