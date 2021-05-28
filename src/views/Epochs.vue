<template>
    <div class="narrow-container">
        <f-view-heading>
            <h1>
                {{ $t("epoch.list_title") }}
                <span v-if="dRecordsCount" class="f-records-count">
                    ({{ dRecordsCount }})
                </span>
            </h1>
        </f-view-heading>
        <epoch-list @records-count="onRecordsCount" />
    </div>
</template>

<script>
import FViewHeading from "../components/FViewHeading.vue";
import EpochList from "@/data-tables/EpochList.vue";

export default {
    name: "Epochs",

    components: {EpochList, FViewHeading },

    data() {
        return {
            dRecordsCount: 0
        };
    },

    methods: {
        onRecordsCount(_num) {
            this.dRecordsCount = _num;
        }
    }
};
</script>
