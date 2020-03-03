<template>
    <div style="display: none"></div>
</template>

<script>
    /**
     * Serves as a data entry for `FBreakpoints` component.
     */
    export default {
        props: {
            /** Breakpoint value. */
            value: {
                type: String,
                default: ''
            },

            /** Use media query instead of just value. */
            media: {
                type: String,
                default: ''
            },

            /** Breakpoint code. */
            code: {
                type: String,
                default: ''
            },

            /** Use min-width in media query. */
            min: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                /** Media query value */
                dMedia: this.media
            }
        },

        created() {
            if (this.value && !this.dMedia) {
                this.dMedia = `only screen and (${this.min ? 'min' : 'max'}-width: ${
                    this.value
                })`;
            }
        }
    }
</script>
