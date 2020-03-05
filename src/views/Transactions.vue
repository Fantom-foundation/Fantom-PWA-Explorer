<template>
    <div class="narrow-container">
        <div class="row">
            <div class="col">
                <h1 class="h2">{{ $t('transaction_list.title') }}</h1>
                <f-transaction-list></f-transaction-list>
            </div>
        </div>
    </div>
</template>

<script>
    import FTransactionList from "../data-tables/FTransactionList.vue";

    export default {
        components: {
            FTransactionList
        }
    }
</script>

<style lang="scss">
</style>
