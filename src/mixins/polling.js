// Mixin for polling

class Polling {
    constructor() {
        // Keys are codes, values are interval ids
        this._intervalIds = {};
        // Timeout of interval in milliseconds
        this._timeout = 3000;
    }

    destroy() {
        const intervalIds = this._intervalIds;

        Object.keys(intervalIds).forEach((_code) => {
            this.stop(_code);
        });
    }

    /**
     * Start polling.
     *
     * @param {string} _code
     * @param {function} _callback
     * @param {int} [_timeout]
     */
    start(_code, _callback, _timeout) {
        this.stop(_code);

        this._intervalIds[_code] = setInterval(_callback, _timeout || this._timeout);
    }

    /**
     * Stop polling.
     *
     * @param {string} _code
     */
    stop(_code) {
        if (_code in this._intervalIds) {
            clearInterval(this._intervalIds[_code]);
            delete this._intervalIds[_code];
        }
    }
}

export const pollingMixin = {
    created() {
        this._polling = new Polling();
    },

    beforeDestroy() {
        if (this._polling) {
            this._polling.destroy();
            this._polling = null;
        }
    },
};
