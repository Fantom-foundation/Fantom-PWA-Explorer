<template>
    <div class="narrow-container">
        <f-view-heading :title="$t('view_assets.title_detail')"></f-view-heading>
        <f-asset-detail :address="$route.params.address" />
    </div>
</template>

<script>
import FViewHeading from "@/components/FViewHeading.vue";
import FAssetDetail from "@/layouts/FAssetDetail.vue";

export default {
    name: "AssetDetail",

    components: {FAssetDetail, FViewHeading}
}
</script>
