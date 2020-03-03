<template>
    <div style="display: none">
        <slot></slot>
    </div>
</template>

<script>
    import events from "../mixins/events.js";

    const _spacesRE = / /g;

    /**
     * Manages media query breakpoints.
     */
    export default {
        mixins: [events],

        created() {
            /** Array of props of `FBreakpoint` components*/
            this._breakpoints = [];
        },

        mounted() {
            this.prepareBreakpoints();
            this.bindBreakpointsEvents();
        },

        methods: {
            /**
             * Collect `FBreakpoint`'s data from default slot.
             */
            prepareBreakpoints() {
                const children = this.$children;
                let breakpoint;

                children.forEach(_child => {
                    if (_child.$options._componentTag === 'f-breakpoint') {
                        breakpoint = {
                            ..._child.$props
                        };

                        breakpoint.media = _child.dMedia;

                        this._breakpoints.push(breakpoint);
                    }
                });
            },

            /**
             * Bind media query events.
             */
            bindBreakpointsEvents() {
                this._breakpoints.forEach(_breakpoint => {
                    const ev = window.matchMedia(_breakpoint.media);
                    ev.addListener(_event => this.onBreakpointChange(_event)); // because of IE11...
                    this.onBreakpointChange(ev);
                });
            },

            /**
             * Return string without spaces.
             *
             * @param _str
             * @return {String}
             */
            withoutSpaces(_str) {
                return _str.replace(_spacesRE, '');
            },

            /**
             * Called when media query breakpoint changes.
             *
             * @param {Event} _event
             */
            onBreakpointChange(_event) {
                const breakpoint = this._breakpoints.filter(
                    _breakpoint =>
                        this.withoutSpaces(_breakpoint.media) === this.withoutSpaces(_event.media),
                );
                let data;

                if (breakpoint.length === 1) {
                    data = {
                        value: breakpoint[0].value,
                        code: breakpoint[0].code,
                        media: _event.media,
                        matches: _event.matches,
                    };
                    
                    this.$store.commit('setBreakpoint', data);
                }
            }
        }
    }
</script>
