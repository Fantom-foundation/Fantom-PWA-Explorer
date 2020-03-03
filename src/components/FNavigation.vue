<template>
    <div class="f-navigation">
        <nav>
            <slot>
                <ul class="no-markers" v-if="cItems">
                    <li v-for="item in cItems" :key="item.id"><router-link :to="item.link">{{ item.label }}</router-link></li>
                </ul>
            </slot>
        </nav>
    </div>
</template>

<script>
    import helpers from "../mixins/helpers.js";

    export default {
        mixins: [
            helpers
        ],

        props: {
            items: {
                type: Array,
                default() {
                    return [];
                }
            }
        },

        computed: {
            cItems() {
                this.setIds(this.items);

                return this.items;
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-navigation {
        nav {
            ul {
                text-align: right;
                li {
                    display: inline-block;
                    margin-left: 0.25rem;

                    a {
                        color: lighten($theme-color, 26) !important;
                        /*font-weight: bold;*/
                        display: inline-block;
                        padding: 1rem;
                        text-decoration: none;
                        transition: all $transition-length ease;
                        border-radius: $border-radius;

                        &.router-link-exact-active, &:hover {
                            color: #fff !important;
                            background-color: lighten($theme-color, 3);
                        }
                    }
                }
            }
        }
    }

    @include media-max($bp-menu) {
        .f-navigation {
            nav {
                ul {
                    li {
                        display: block;
                        a {

                        }
                    }
                }
            }
        }
    }
</style>
