<template>
    <ul class="f-breadcrumbs no-markers">
        <li v-for="item in cItems" :key="item.id">
            <router-link v-if="item.name" :to="{name: item.name}">{{ item.title }}</router-link>
            <span v-else class="curr-route">{{ item.title }}</span>
            <icon v-if="item.name" data="@/assets/svg/angle-right.svg" color="#999" class="rtl-mirror"></icon>
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
    .f-breadcrumbs {
        color: $grey-color-lighter;
        text-align: end;
        font-size: 0.9em;

        li {
            display: inline-block;
            vertical-align: middle;

            @include links() {
                color: inherit;
                padding-inline-start: 4px;
                padding-inline-end: 4px;
            }

            .curr-route {
                padding-inline-start: 4px;
            }
        }
    }
</style>
