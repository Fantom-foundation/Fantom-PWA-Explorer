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
            <button type="submit" class="light large same-size round">
                <icon data="@/assets/svg/search.svg" width="24" height="24"></icon>
            </button>
        </form>
    </div>
</template>

<script>
    export default {
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
            }
        },

        methods: {
            expand() {
                const parentElem = this.$el.closest('.narrow-container')

                if (!parentElem) {
                    return;
                }

                const inlineStyle = this.inlineStyle;

/*
                inlineStyle.position = '';
                inlineStyle.top = '';
                inlineStyle.left = '';
*/

                const parentElemRect = parentElem.getBoundingClientRect();
                const width = parentElemRect.width * 0.8;
                const elRect = this.$el.getBoundingClientRect();
                const tx = elRect.left - (parentElemRect.left + ((parentElemRect.width - width) / 2));

                inlineStyle.position = 'fixed';
                inlineStyle.top = `${elRect.top}px`;
                inlineStyle.left = `${elRect.left}px`;
                inlineStyle.transform = `translateX(-${tx}px)`;

                inlineStyle.width = `${width}px`;
            },

            collapse() {
                const inlineStyle = this.inlineStyle;

                inlineStyle.width = '';
                inlineStyle.transform = '';

                setTimeout(() => {
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

            blurInput() {
                const eInput = this.$el.querySelector('input');

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

        &.dark-theme {
            button[type="submit"] {
                /*color: #fff;*/
            }
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
                input:not(.def):not([type=submit]).large {
                    padding-right: 48px;

                    &::placeholder {
                        color: #666;
                    }
                }
            }

/*
            &.expanded {
                width: 100%;
                transform: translateX(50%);

                form {
                    !*width: 100%;*!
                    !*transform: translateX(10%);*!
                }

                input:not(.def):not([type=submit]).large {
                    padding-right: 48px;
                    background-color: $input-bg-color;
                    border-color: $input-border-color;
                    box-shadow: $elev3-shadow;
                }
            }
*/
        }
    }
</style>
