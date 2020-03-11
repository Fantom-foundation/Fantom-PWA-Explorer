<template>
    <div class="f-search-box" :class="cCssClass" :style="inlineStyle">
        <form action="" autocomplete="off" @submit.prevent="onSubmit">
            <input
                type="search"
                name="search"
                class="large"
                :placeholder="$t('view_home.search_input_placeholder')"
                :aria-label="$t('view_home.search_input_placeholder')"
                v-model="searchText"
                @focus="onFocus"
                @blur="onBlur"
            >
            <button type="submit" class="light large same-size round" :class="{'no-hover': expandable}">
                <icon data="@/assets/svg/search.svg" width="20" height="20"></icon>
            </button>
        </form>
    </div>
</template>

<script>
    import events from "../mixins/events.js";
    import { throttle } from "../utils";
    import { clientInfo } from "../utils/client-info.js";

    export default {
        mixins: [events],

        props: {
            /** Is search box expandable? */
            expandable: {
                type: Boolean,
                default: false
            },

            /** Is search box expanded? */
            expanded: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                /** Inline style used for expand/collapse. */
                inlineStyle: {
                    position: '',
                    top: '',
                    left: '',
                    width: '',
                    transform: ''
                },
                /** Search input value. */
                searchText: '',
                /** Is search box expanded? */
                dExpanded: this.expanded
            }
        },

        watch: {
            dExpanded() {
                if (this.expandable) {
                    if (this.dExpanded) {
                        this.expand();
                    } else {
                        this.collapse();
                    }
                }
            }
        },

        computed: {
            /**
             * Container's css classes.
             */
            cCssClass() {
                return {
                    'expandable': this.expandable,
                    'expanded': this.dExpanded
                }
            },

            /**
             * Property is set to `true`, if 'menu-mobile' breakpoint is reached.
             *
             * @return {Boolean}
             */
            cMobileView() {
                const menuBreakpoint = this.$store.state.breakpoints['menu-mobile'];

                return (menuBreakpoint && menuBreakpoint.matches);
            }
        },

        mounted() {
            if (this.expandable) {
                this.bindEvent(window, 'blur', () => {this.blurInput(true);});

                if (clientInfo.mobile) {
                    this.bindEvent(window, 'orientationchange', () => {this.blurInput(true);}, 300, true);
                } else {
                    this.bindEvent(window, 'resize', throttle(() => {this.blurInput(true);}, 300, true));
                }
            }
        },

        methods: {
            expand() {
                const parentElem = this.$el.parentNode;

                if (!parentElem) {
                    return;
                }

                const inlineStyle = this.inlineStyle;

                inlineStyle.position = '';
                inlineStyle.top = '';
                inlineStyle.left = '';

                const winWidth = window.innerWidth;
                const parentElemRect = parentElem.getBoundingClientRect();
                const elRect = this.$el.getBoundingClientRect();
                const width = (this.cMobileView ? winWidth * 0.98 : (elRect.left - parentElemRect.left + elRect.width));
                const tx = (this.cMobileView ? elRect.left - winWidth * 0.01 : elRect.left - parentElemRect.left);
                // const width = parentElemRect.width * 0.98;
                // const tx = elRect.left - (parentElemRect.left + ((parentElemRect.width - width) / 2));

                document.body.classList.add('search-box-on');

                inlineStyle.position = 'fixed';
                inlineStyle.top = `${elRect.top}px`;
                inlineStyle.left = `${elRect.left}px`;
                inlineStyle.transform = `translateX(-${tx}px)`;

                inlineStyle.width = `${width}px`;

                setTimeout(() => {
                    document.body.classList.add('search-box-on-anim-end');
                }, 250);
            },

            collapse() {
                const inlineStyle = this.inlineStyle;

                inlineStyle.width = '';
                inlineStyle.transform = '';

                document.body.classList.remove('search-box-on-anim-end');

                setTimeout(() => {
                    document.body.classList.remove('search-box-on');

                    inlineStyle.position = '';
                    inlineStyle.top = '';
                    inlineStyle.left = '';
                }, 250);
            },

            focusInput() {
                const eInput = this.$el.querySelector('input');

                if (eInput) {
                    eInput.focus();
                }
            },

            blurInput(_clear) {
                const eInput = this.$el.querySelector('input');

                if (_clear) {
                    this.dExpanded = false;
                    this.searchText = '';
                }

                if (eInput) {
                    eInput.blur();
                }
            },

            /**
             * Triggered on form submit event.
             */
            onSubmit() {
                let searchText;

                if (!this.dExpanded) {
                    this.focusInput();
                } else {
                    searchText = this.searchText.trim();

                    if (searchText) {
                        console.log('search', searchText);
                    }

                    this.searchText = '';
                    // if (this.expandable) {
                        this.blurInput();
                        // this.dExpanded = false;
                    // }
                }
            },

            /**
             * Triggered on search input focus event.
             */
            onFocus() {
                this.dExpanded = true;
            },

            /**
             * Triggered on search input blur event.
             */
            onBlur() {
                if (this.expandable && this.dExpanded) {
                    setTimeout(() => {
                        this.dExpanded = false;
                        this.searchText = '';
                    }, 150);
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-search-box {
        display: inline-block;

        form {
            display: inline-block;
            position: relative;
            width: 100%;
            /*margin: 0 auto;*/

            /*transition: all $transition-length ease;*/
        }

        input:not(.def):not([type=submit]).large {
            width: 100%;
            height: 3.5rem;
            padding-right: 48px;
            text-align: center;
            border-radius: 3.5rem !important;
            outline: none;
            box-shadow: $elev3-shadow;
            /*background-color: transparent;*/
            /*border-color: transparent;*/
        }

        button[type="submit"] {
            position: absolute;
            top: 6px;
            right: 6px;
            outline: none;
        }

        button[type="submit"]:focus {
            color: $theme-color !important;
            background-color: transparent !important;
        }

        &.expandable {
            width: 56px;
            transition: all $transition-length ease;

            input:not(.def):not([type=submit]).large {
                padding-right: 0;

                &::placeholder {
                    color: transparent;
                }
            }

            form {
            }

            &.expanded {
                margin-left: 0;

                input:not(.def):not([type=submit]).large {
                    /*padding-right: 48px;*/

                    &::placeholder {
                        color: #666;
                    }
                }
            }
        }

        &.small {
            input:not(.def):not([type=submit]).large {
                height: 44px;
            }

            button[type="submit"] {
                top: 0;
                right: 0;
            }

            &.expandable {
                width: 44px;

                &:not(.expanded) {
                    input:not(.def):not([type=submit]).large {
                        background-color: $secondary-color-lightest;
                        border-color: transparent;
                    }

                    button[type="submit"]:hover {
                        background-color: #fff !important;
                    }
                }
            }
        }
    }

    .search-box-on-anim-end .f-search-box.expandable.expanded input:not(.def):not([type=submit]).large {
        padding-right: 48px;
    }
</style>