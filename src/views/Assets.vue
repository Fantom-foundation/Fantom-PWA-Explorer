<template>
    <div class="narrow-container">
        <f-view-heading>
            <h1>{{ $t('view_assets.title') }} (ERC-20) <span v-if="dRecordsCount" class="f-records-count">({{ dRecordsCount }})</span></h1>
        </f-view-heading>
        <asset-list />
    </div>
</template>

<script>

import FViewHeading from "@/components/FViewHeading.vue";
import AssetList from "@/data-tables/AssetList.vue";

export default {
    name: "Assets",

    components: {AssetList, FViewHeading},

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
