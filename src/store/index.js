import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        breakpoints: {}
    },

    mutations: {
        setBreakpoint(_state, _breakpoint) {
            _state.breakpoints = {..._state.breakpoints, ...{[_breakpoint.code]: _breakpoint}};
        }
    }
});
