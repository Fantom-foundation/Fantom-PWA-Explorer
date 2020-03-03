<template>
    <header class="f-header" :class="cssClass">
        <div class="narrow-container">
            <div class="row no-collapse align-items-center">
                <div class="col-2">Logo</div>
                <div class="col right-col">
                    <f-navigation
                        :items="navigation"
                    ></f-navigation>
                    <f-hamburger-switch
                        thickness="2"
                        @hamburger-switch-on="onHamburgerSwitchOn"
                        @hamburger-switch-off="onHamburgerSwitchOff"
                    ></f-hamburger-switch>
                </div>
            </div>
        </div>

        <div class="f-drawer" @click="onDrawerClick"></div>
    </header>
</template>

<script>
    import FNavigation from "../components/FNavigation.vue";
    import FHamburgerSwitch from "../components/FHamburgerSwitch.vue";
    import { navigation } from "../navigation.js";
    import { mapState } from 'vuex';

    /**
     * Renderes header and takes care of navigation.
     */
    export default {
        components: {
            FNavigation,
            FHamburgerSwitch
        },

        data() {
            return {
                navigation,
                drawerOn: false
            }
        },

        computed: {
            cssClass() {
                return {
                    'drawer-on': this.drawerOn
                }
            },

            ...mapState(['breakpoints'])
        },

        watch: {
            /**
             * Watches for vue route change.
             */
            $route() {
                this.hamburgerSwitchOff();
            },

            /**
             * Watches for `breakpoints` state change.
             *
             * @param {object} _breakpoints
             */
            breakpoints(_breakpoints) {
                const menuMobileBreakpoint = _breakpoints['menu-mobile'];

                if (menuMobileBreakpoint && !menuMobileBreakpoint.matches) {
                    this.hamburgerSwitchOff();
                }
            }
        },

        methods: {
            moveNavigationToDrawer() {
                if (!this.$el) {
                    return;
                }

                const eFNavigation = this.$el.querySelector('.f-navigation');
                const eDrawer = this.$el.querySelector('.f-drawer');

                if (eFNavigation && eDrawer) {
                    eDrawer.appendChild(eFNavigation);
                }
            },

            moveNavigationFromDrawer() {
                if (!this.$el) {
                    return;
                }

                const eFNavigation = this.$el.querySelector('.f-navigation');
                const eRightCol = this.$el.querySelector('.right-col');

                if (eFNavigation && eRightCol) {
                    eRightCol.appendChild(eFNavigation);
                }
            },

            hamburgerSwitchOff() {
                this.$children.forEach(_child => {
                    if (_child.$options._componentTag === 'f-hamburger-switch') {
                        _child.dOn = false;
                    }
                });
            },

            onHamburgerSwitchOn() {
                this.moveNavigationToDrawer();
                this.drawerOn = true;
            },

            onHamburgerSwitchOff() {
                this.drawerOn = false;
                setTimeout(() => {
                    this.moveNavigationFromDrawer();
                }, 300);
            },

            onDrawerClick() {
                this.hamburgerSwitchOff();
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-header {
        /*position: -webkit-sticky;*/
        /*position: sticky;*/
        position: fixed;
        top: 0;
        z-index: 10;
        width: 100%;
        height: var(--f-header-height);
        color: #fff;
        background-color: $theme-color;
        transition: height $transition-length ease;

        .narrow-container {
            padding-top: 0;
            padding-bottom: 0;
        }

        .f-hamburger-switch {
            position: fixed;
            top: 8px;
            right: 16px;
            z-index: 11;
            display: none;
        }

        .f-drawer {
            position: fixed;
            z-index: 10;
            width: 100%;
            height: 100%;
            top: 0;
            padding: 64px 8px 24px 8px;
            background-color: $theme-color;
            transform: translateX(100%);
            transition: all $transition-length ease;
            display: none;
        }

        &.drawer-on {
            .f-drawer {
                transform: translateX(0);
            }
        }
    }

    @include media-max($bp-menu) {
        .f-header {
            .right-col {
                text-align: right;
            }

            .f-hamburger-switch {
                display: inline-block;

                &.on {
                }
            }

            .f-drawer {
                display: block;
            }

            .right-col {
                .f-navigation {
                    display: none;
                }
            }

            &.drawer-on {
                .f-navigation {
                    display: block;
                }
            }
        }
    }
</style>
