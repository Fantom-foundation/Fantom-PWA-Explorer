import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexPlugins = [];

const vuexLocalStorage = new VuexPersist({
    // The key to store the state on in the storage provider.
    key: 'vuex-fantom-explorer',
    storage: window.localStorage,
    asyncStorage: false,
    // Function that passes the state and returns the state with only the Objects you want to store.
    reducer: (_state) => ({
        darkMode: _state.darkMode,
    }),
});

vuexPlugins.push(vuexLocalStorage.plugin);

export const store = new Vuex.Store({
    plugins: vuexPlugins,

    state: {
        breakpoints: {},
        tokenPrice: 0,
        gasPrice: 0,
        darkMode: true,
        pageVisible: true,
    },

    mutations: {
        /**
         * @param {object} _state
         * @param {object} _breakpoint
         */
        setBreakpoint(_state, _breakpoint) {
            _state.breakpoints = {..._state.breakpoints, ...{[_breakpoint.code]: _breakpoint}};
        },

        /**
         * @param {object} _state
         * @param {number} _tokenPrice
         */
        setTokenPrice(_state, _tokenPrice) {
            _state.tokenPrice = _tokenPrice;
        },

        /**
         * @param {object} _state
         * @param {number} _gasPrice
         */
        setGasPrice(_state, _gasPrice) {
            _state.gasPrice = _gasPrice;
        },

        /**
         * @param {object} _state
         * @param {boolean} _on
         */
        setDarkMode(_state, _on) {
            _state.darkMode = _on;
        },

        /**
         * @param {object} _state
         * @param {boolean} _on
         */
        setPageVisible(_state, _visible) {
            _state.pageVisible = _visible;
        }
    }
});
