<template>
    <div class="narrow-container">
        <f-view-heading :title="$t('view_transaction_list.title')"></f-view-heading>
        <f-transaction-list-local></f-transaction-list-local>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FTransactionListLocal from "../data-tables/FTransactionListLocal.vue";

    export default {
        components: {
            FTransactionListLocal,
            FViewHeading
        }
    }
</script>

<style lang="scss">
</style>
