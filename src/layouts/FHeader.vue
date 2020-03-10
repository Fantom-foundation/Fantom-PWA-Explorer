<template>
    <header class="f-header" :class="cCssClass">
        <div class="narrow-container">
            <div class="row no-collapse align-items-center">
                <div class="col-2">
                    <router-link to="/" class="logo"><img src="fantom-logo.svg" alt="" class="not-fluid"></router-link>
                </div>
                <div class="col right-col">
                    <f-navigation
                        :items="cNavigation"
                    ></f-navigation>
                    <f-hamburger-switch
                        thickness="2"
                        two-lines
                        @hamburger-switch-on="onHamburgerSwitchOn"
                        @hamburger-switch-off="onHamburgerSwitchOff"
                    ></f-hamburger-switch>
                </div>
            </div>
        </div>

        <div class="f-drawer" @click="onDrawerClick">
            <div class="body"></div>
            <div class="footer">
                <f-social-media-links></f-social-media-links>
            </div>
        </div>
    </header>
</template>

<script>
    import FNavigation from "../components/FNavigation.vue";
    import FHamburgerSwitch from "../components/FHamburgerSwitch.vue";
    import FSocialMediaLinks from "../components/FSocialMediaLinks.vue";
    import { mapState } from 'vuex';

    /**
     * Renderes header and takes care of navigation.
     */
    export default {
        components: {
            FNavigation,
            FHamburgerSwitch,
            FSocialMediaLinks
        },

        data() {
            return {
                /** Is drawer visible? */
                dDrawerOn: false
            }
        },

        computed: {
            /**
             * Get navigation by current language.
             *
             * @return {array}
             */
            cNavigation() {
                const messages = this.$i18n.messages[this.$i18n.locale];

                return messages.navigation || [];
            },

            /**
             * Container's css classes.
             *
             * @retun {object}
             */
            cCssClass() {
                return {
                    'drawer-on': this.dDrawerOn
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
                const eDrawer = this.$el.querySelector('.f-drawer .body');

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
                this.dDrawerOn = true;
            },

            onHamburgerSwitchOff() {
                this.dDrawerOn = false;
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

        .logo {
            > img {
                max-height: 36px;
                margin-bottom: 0 !important;
                transition: opacity $transition-length ease;
            }
        }

        .f-hamburger-switch {
            position: fixed;
            top: 12px;
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
            padding: 64px 8px 20px 8px;
            background-color: $theme-color;
            transform: translateX(100%);
            transition: all $transition-length ease;
            display: none;
            flex-direction: column;

            .body {
                flex: 1;
            }

            .footer {
                .f-social-media-links {
                    text-align: center;
                }
            }
        }

        &.drawer-on {
            .f-drawer {
                transform: translateX(0);
            }
        }
    }

    @include media-max($bp-menu) {
        .f-header {
            .logo {
                position: fixed;
                top: 10px;
                left: 16px;
                z-index: 11;

                > img {
                    max-height: 28px;
                }
            }

            &.drawer-on {
                .logo {
                    > img {
                        opacity: 0.5;
                    }
                }
            }


            .right-col {
                text-align: right;
            }

            .f-hamburger-switch {
                display: inline-block;

                &.on {
                }
            }

            .f-drawer {
                display: flex;
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
