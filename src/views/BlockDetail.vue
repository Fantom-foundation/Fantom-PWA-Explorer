<template>
    <div class="narrow-container">
        <f-view-heading :title="$t('view_block_detail.title')"></f-view-heading>
        <f-block-detail :id="parseInt($route.params.id)"></f-block-detail>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FBlockDetail from "../layouts/FBlockDetail.vue";

    export default {
        components: {
            FViewHeading,
            FBlockDetail
        }
    }
</script>
