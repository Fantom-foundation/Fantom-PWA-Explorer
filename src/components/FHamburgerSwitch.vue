<template>
    <div class="f-hamburger-switch" role="switch" :class="[cCssClass, `thickness${thickness}`]" @click="toggle">
        <div class="cont">
            <div class="l1"></div>
            <div class="l2" v-if="!twoLines"></div>
            <div class="l3"></div>
        </div>
    </div>
</template>

<script>
    import events from "../mixins/events.js";

    export default {
        mixins: [ events ],

        props: {
            /** Is switch on? */
            on: {
                type: Boolean,
                default: false
            },

            /** Thickness of one switch row. */
            thickness: {
                type: String,
                default: '1'
            },

            /** Use just 2 lines instead of 3. */
            twoLines: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                /** Is switch on? */
                dOn: this.on
            }
        },

        watch: {
            dOn() {
                if (this.dOn) {
                    this.$emit('hamburger-switch-on');
                } else {
                    this.$emit('hamburger-switch-off');
                }
            }
        },

        computed: {
            /**
             * Container's css classes.
             */
            cCssClass() {
                return {
                    'on': this.dOn
                }
            }
        },

        methods: {
            toggle() {
                this.dOn = !this.dOn;
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-hamburger-switch {
        display: inline-block;
        width: 24px;
        height: 24px;
        cursor: pointer;
        /*transform: scale(1.1);*/

        .cont {
            position: relative;
            width: 100%;
            height: 100%;
            /*border: 1px solid transparent;*/
        }

        .l1, .l2, .l3 {
            position: absolute;
            width: 100%;
            height: 2px;
            background-color: #fff;
            border-radius: 3px;
            transition: all $transition-length ease;
        }

        .l1 {
            top: 0;
        }

        .l2 {
            top: 50%;
        }

        .l3 {
            bottom: 0;
        }

        &.thickness1 {
            .l1 {
                top: 10%;
            }

            .l2 {
                margin-top: -1px;
            }

            .l3 {
                bottom: 10%;
            }
        }

        &.thickness2 {
            .l1, .l2, .l3 {
                height: 4px;
            }

            .l1 {
                top: 5%;
            }

            .l2 {
                margin-top: -2px;
            }

            .l3 {
                bottom: 5%;
            }
        }

        &.thickness3 {
            .l1, .l2, .l3 {
                height: 6px;
            }

            .l2 {
                margin-top: -3px;
            }
        }

        &.on {
            .l1 {
                /*opacity: 1;*/
                /*transform: translate(0, 10px) rotate(45deg);*/
                top: 0;
                transform: translate(0, 11px) rotate(45deg);
            }

            .l2 {
                opacity: 0;
            }

            .l3 {
                /*opacity: 1;*/
                bottom: 0;
                transform: translate(0, -11px) rotate(-45deg);
            }

            &.thickness2 {
                .l1 {
                    transform: translate(0, 10px) rotate(45deg);
                }

                .l3 {
                    transform: translate(0, -10px) rotate(-45deg);
                }
            }

            &.thickness3 {
                .l1 {
                    transform: translate(0, 9px) rotate(45deg);
                }

                .l3 {
                    transform: translate(0, -9px) rotate(-45deg);
                }
            }
        }
    }
</style>
