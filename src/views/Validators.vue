<template>
    <div class="narrow-container">
        <f-view-heading>
            <h1>{{ $t('view_validator_list.title') }} <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h1>
        </f-view-heading>

        <f-validators-info @records-count="onRecordsCount"></f-validators-info>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FValidatorsInfo from "../layouts/FValidatorsInfo.vue";

    export default {
        components: {
            FViewHeading,
            FValidatorsInfo
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
