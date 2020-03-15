<template>
    <div class="narrow-container">
        <f-view-heading>
            <h1>{{ $t('view_validator_list.title') }} <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h1>
        </f-view-heading>
        <f-validator-list @records-count="onRecordsCount"></f-validator-list>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FValidatorList from "../data-tables/FValidatorList.vue";

    export default {
        components: {
            FViewHeading,
            FValidatorList
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
