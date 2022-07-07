export let apolloNetworkStatus = null;

export class ApolloNetworkStatus {
    /**
     * @param {Vue} _Vue
     */
    static install(_Vue) {
        if (!apolloNetworkStatus) {
            apolloNetworkStatus = new ApolloNetworkStatus();
            _Vue.prototype.$apolloNetworkStatus = apolloNetworkStatus;
        }
    }

    constructor() {
        this._callbacks = [];
    }

    online() {
        this._callbacks.forEach(_callback => {
            _callback('online');
        });
    }

    offline() {
        this._callbacks.forEach(_callback => {
            _callback('offline');
        });
    }

    /**
     * @param {function} _callback
     */
    addCallback(_callback) {
        this._callbacks.push(_callback);
    }

    /**
     * @param {function} _callback
     */
    removeCallback(_callback) {
        const callbacks = this._callbacks;

        for (let i = 0, len = callbacks.length; i < len; i++) {
            if (callbacks[i] === _callback) {
                callbacks.splice(i, 0);
                break;
            }
        }
    }
}
