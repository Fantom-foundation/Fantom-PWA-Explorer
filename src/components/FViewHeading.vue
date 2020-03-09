<template>
    <div class="f-view-heading">
        <div class="row">
            <div class="col-4 col-12-md">
                <h1>{{ title }}</h1>
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

            /** Name of current route. */
            currRoute: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-view-heading {
        h1 {
            margin-bottom: 4px;
        }
    }
</style>
