<template>
    <div class="narrow-container">
        <f-view-heading :title="$t('view_transaction_list.title')"></f-view-heading>
        <f-transaction-list></f-transaction-list>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FTransactionList from "../data-tables/FTransactionList.vue";

    export default {
        components: {
            FViewHeading,
            FTransactionList
        }
    }
</script>

<style lang="scss">
</style>
