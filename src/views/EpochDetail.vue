<template>
    <div class="narrow-container">
        <f-view-heading :title="$t('epoch.detail_title')"></f-view-heading>
        <f-epoch-detail :id="parseInt($route.params.id)"></f-epoch-detail>
    </div>
</template>

<script>
import FViewHeading from "../components/FViewHeading.vue";
import FEpochDetail from "@/layouts/FEpochDetail.vue";

export default {
    components: {
        FEpochDetail,
        FViewHeading
    }
}
</script>
