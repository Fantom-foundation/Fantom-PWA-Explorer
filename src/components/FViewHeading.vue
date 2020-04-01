<template>
    <div class="f-view-heading">
        <div class="row align-items-center">
            <div :class="`col-${firstColumnWidth} col-12-md`">
                <slot><h1>{{ title }}</h1></slot>
            </div>
            <div class="col hidden-md">
                <f-breadcrumbs :curr-route="currRoute"></f-breadcrumbs>
            </div>
        </div>
    </div>
</template>

<script>
    import FBreadcrumbs from "./FBreadcrumbs.vue";

    /**
     * Heading for views - h1 and breadcrumbs.
     */
    export default {
        components: {
            FBreadcrumbs
        },

        props: {
            /** View title. (h1) */
            title: {
                type: String,
                default: ''
            },

            /**
             * Width of first grid column (from '1' to '12').
             */
            firstColumnWidth: {
                type: String,
                default: '4'
            },

            /** Name of current route. */
            currRoute: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style lang="scss">
    .f-view-heading {
        h1 {
            margin-bottom: 8px;
        }
    }
</style>
