<template>
    <div class="narrow-container">
        <f-view-heading>
            <h1>{{ $t('view_transaction_list.title') }} <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h1>
        </f-view-heading>
        <f-transaction-list @records-count="onRecordsCount"></f-transaction-list>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FTransactionList from "../data-tables/FTransactionList.vue";

    export default {
        components: {
            FTransactionList,
            FViewHeading
        },

        data() {
            return {
                dRecordsCount: 0
            }
        },

        methods: {
            onRecordsCount(_num) {
                this.dRecordsCount = _num;
            }
        }
    }
</script>

<style lang="scss">
</style>
