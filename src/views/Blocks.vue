<template>
    <div class="narrow-container">
        <f-view-heading :title="$t('view_block_list.title')"></f-view-heading>
        <f-block-list></f-block-list>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FBlockList from "../data-tables/FBlockList.vue";

    export default {
        components: {
            FViewHeading,
            FBlockList
        }
    }
</script>

<style lang="scss">
</style>
