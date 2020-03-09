<template>
    <ul class="f-breadcrumbs no-markers">
        <li v-for="item in cItems" :key="item.id">
            <router-link v-if="item.name" :to="{name: item.name}">{{ item.title }}</router-link>
            <span v-else class="curr-route">{{ item.title }}</span>
        </li>
    </ul>
</template>

<script>
    import { appStructureTree } from "../app-structure.js";

    export default {
        props: {
            /** Name of current route. */
            currRoute: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                dCurrRoute: this.currRoute || this.$router.currentRoute.name
            }
        },

        computed: {
            cItems() {
                const parents = appStructureTree.getParents(this.dCurrRoute);
                const items = [];
                let parent;

                for (let i = parents.length - 1; i >= 0; i -= 1) {
                    parent = parents[i];

                    items.push({
                        id: parent.id,
                        name: (i > 0 ? parent.id : ''),
                        title: this.$t(parent.translation)
                    });
                }

                return items;
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-breadcrumbs {
        text-align: right;

        li {
            display: inline-block;
            vertical-align: middle;

            &:not(:last-child)::after {
                padding-right: 8px;
                content: '\00BB';
            }

            a {
                padding-right: 8px;
            }

            .curr-route {
                font-weight: bold;
            }
        }
    }
</style>
