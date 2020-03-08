<template>
    <div class="f-card" :class="cssClass">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            /** No card style. */
            off: {
                type: Boolean,
                default: false
            },

            /** Use hover animation. */
            hover: {
                type: Boolean,
                default: false
            },

            /** Use zoom animation. */
            zoomHover: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                pHover: this.hover
            }
        },

        computed: {
            cssClass() {
                return {
                    'off': this.off,
                    'f-card-hover': this.pHover,
                    'zoom': this.zoomHover
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-card:not(.off) {
        padding: 20px;
        /*border: 1px solid #f8f8f8;*/
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 0 0 40px 0 rgba(0,0,0,.06);
        transition: box-shadow $transition-length ease, transform $transition-length ease;

        &.f-card-hover:hover {
            box-shadow: $elev6-shadow;
        }

        &.f-card-hover.zoom:hover {
            transform: scale(1.04);
        }
/*
        &[hover]:hover {
            box-shadow: $elev6-shadow;
        }
*/
    }
</style>
