<template>
    <div class="narrow-container">
        <div class="row">
            <div class="col">
                <h1>{{ $t('view_transaction_detail.title') }}</h1>
            </div>
        </div>

        <f-transaction-detail
            :id="$route.params.id"
        ></f-transaction-detail>
    </div>
</template>

<script>
    import FTransactionDetail from "../layouts/FTransactionDetail.vue";

    export default {
        components: {
            FTransactionDetail
        }
    }
</script>

<style lang="scss">
</style>
