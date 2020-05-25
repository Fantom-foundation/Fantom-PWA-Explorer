// Implements simple event bus. Binded events are automatically unbinded before component is destroyed.

import Vue from 'vue';

const root = new Vue();

class EventBus {
    constructor() {
        this._events = {};
    }

    destroy() {
        this.unbindAll();
    }

    /**
     * Bind event.
     *
     * @param {string} _eventName
     * @param {function} _listener
     */
    on(_eventName, _listener) {
        const events = this._events;

        root.$on(_eventName, _listener);

        if (!events[_eventName]) {
            events[_eventName] = [];
        }

        events[_eventName].push(_listener);
    }

    /**
     * Unbind event.
     *
     * @param {string} _eventName
     * @param {function} _listener
     * @param {boolean} [_dontRemoveEvent]
     */
    off(_eventName, _listener, _dontRemoveEvent) {
        const events = this._events[_eventName];

        if (events) {
            root.$off(_eventName, _listener);

            for (let i = 0, len1 = events.length; i < len1; i++) {
                if (events[i] === _listener) {
                    if (!_dontRemoveEvent) {
                        events.splice(i, 1);
                    }
                    break;
                }
            }

            if (events.length === 0) {
                delete this._events[_eventName];
            }
        }
    }

    /**
     * @param {string} _eventName
     * @param {*} _data
     */
    emit(_eventName, _data) {
        root.$emit(_eventName, _data);
    }

    /**
     * Unbind all events.
     */
    unbindAll() {
        const events = this._events;
        let evs;
        let i = 0;

        for (let name in events) {
            evs = events[name];
            for (i = 0; i < evs.length; i++) {
                this.off(name, evs[i], true);
                evs[i] = null;
            }

            delete events[name];
            evs = null;
        }
    }
}

export const eventBusMixin = {
    created() {
        this._eventBus = new EventBus();
    },

    beforeDestroy() {
        if (this._eventBus) {
            this._eventBus.destroy();
            this._eventBus = null;
        }
    },
};
