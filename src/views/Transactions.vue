<template>
    <div class="narrow-container">
        <div class="row">
            <div class="col">
                <div class="row">
                    <div class="col">
                        <h1>{{ $t('view_transaction_list.title') }}</h1>
                    </div>
                    <div class="col">
                        <f-breadcrumbs :curr-route="$router.currentRoute.name"></f-breadcrumbs>
                    </div>
                </div>

                <f-transaction-list></f-transaction-list>
            </div>
        </div>
    </div>
</template>

<script>
    import FTransactionList from "../data-tables/FTransactionList.vue";
    import FBreadcrumbs from "../components/FBreadcrumbs.vue";

    export default {
        components: {
            FTransactionList,
            FBreadcrumbs
        }
    }
</script>

<style lang="scss">
</style>
