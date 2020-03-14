<template>
    <div class="narrow-container">
        <f-view-heading>
            <h1>{{ $t('view_block_list.title') }} <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h1>
        </f-view-heading>
        <f-block-list @records-count="onRecordsCount"></f-block-list>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FBlockList from "../data-tables/FBlockList.vue";

    export default {
        components: {
            FViewHeading,
            FBlockList
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
