<template>
    <div class="narrow-container">
        <f-view-heading :title="$t('view_transaction_detail.title')"></f-view-heading>
        <f-transaction-detail :id="$route.params.id"></f-transaction-detail>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FTransactionDetail from "../layouts/FTransactionDetail.vue";

    export default {
        components: {
            FViewHeading,
            FTransactionDetail
        }
    }
</script>
