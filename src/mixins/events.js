import { uppercaseFirstChar } from "../utils";

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
    created() {
        this._DOMEvents = {};
    },

    beforeDestroy() {
        this.unbindAll();
    },

    methods: {
        emitCustomEvent(_eventName, _data, _elem) {
            const elem = _elem || this.$el;

            // emit vue custom event as well
            this.$emit(_eventName, {detail: _data});

            return dispatchCustomEvent(_eventName, _data, elem);
        },

        /**
         * Bind event and save element and callback for later unbinding.
         *
         * @param {HTMLElement} _elem
         * @param {string} _eventName
         * @param {function} [_callback] If not set, _onFoo method will be binded.
         */
        bindEvent(_elem, _eventName, _callback) {
            let methodName;

            if (!_callback) {
                // add auto method
                methodName = `on${uppercaseFirstChar(_eventName)}`;
                // eslint-disable-next-line no-param-reassign
                _callback = this[methodName];
                if (typeof _callback !== 'function') {
                    throw new Error(
                        `No method '${methodName}' defined. ${
                            this.tagName ? this.tagName.toLowerCase() : ''
                        }`,
                    );
                }
            }

            const callback = _event => _callback.call(this, _event);

            _elem.addEventListener(_eventName, callback, false);

            const { _DOMEvents } = this;

            if (!_DOMEvents[_eventName]) {
                _DOMEvents[_eventName] = [];
            }

            _DOMEvents[_eventName].push({
                elem: _elem,
                callback
            });
        },

        /**
         * Bind events on an element. `foo` event is binded to `this._onFoo` function (method).
         *
         * @param {HTMLElement} _elem
         * @param {string} _eventNames
         * @param {function} [_callback] If not set, _onFoo method will be binded.
         */
        bindEvents(_elem, _eventNames, _callback) {
            const eventNames = _eventNames.split(' ');
            let eventName;

            for (let i = 0, len1 = eventNames.length; i < len1; i += 1) {
                eventName = eventNames[i];
                eventName.trim();

                if (eventName) {
                    this.bindEvent(_elem, eventName, _callback);
                }
            }
        },

        /**
         * @param {String} _eventName
         */
        unbindByEventName(_eventName) {
            const DOMEventBindings = this._DOMEvents ? this._DOMEvents[_eventName] : null;
            let binding;

            if (DOMEventBindings) {
                for (let i = 0, len1 = DOMEventBindings.length; i < len1; i += 1) {
                    binding = DOMEventBindings[i];

                    binding.elem.removeEventListener(_eventName, binding.callback);

                    delete binding.elem;
                    delete binding.callback;
                }

                if (DOMEventBindings.length === 1) {
                    delete this._DOMEvents[_eventName];
                }
            }
        },

        unbindAll() {
            const { _DOMEvents } = this;

            if (_DOMEvents) {
                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const _eventName in _DOMEvents) {
                    this.unbindByEventName(_eventName);
                }

                this._DOMEvents = {};
            }
        }
    }
}
