import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        breakpoints: {},
        tokenPrice: 0
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
        }
    }
});
