<template>
    <div class="f-navigation">
        <nav>
            <slot>
                <ul class="no-markers" v-if="cItems">
                    <li v-for="item in cItems" :key="item.id"><router-link :to="item.url">{{ item.title }}</router-link></li>
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
            /**
             * Array of navigation links.
             *
             * One item is an object with keys:
             * `url` - link url
             * `title` - link title
             */
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
        display: inline-block;

        nav {
            ul {
                text-align: right;
                li {
                    display: inline-block;
                    margin-left: 4px;

                    @include links() {
                        color: $secondary-color-lighter;
                        font-weight: bold;
                        letter-spacing: normal;
                        display: inline-block;
                        padding: 16px 20px;
                        text-decoration: none;
                        transition: all $transition-length ease;
                        border-radius: $border-radius;

                        &.router-link-exact-active, &:hover {
                            color: #fff;
                            text-decoration: none;
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
                            font-size: 1.5em;
                        }
                    }
                }
            }
        }
    }
</style>
