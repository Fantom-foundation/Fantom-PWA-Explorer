<template>
    <div class="address-detail narrow-container">
        <f-view-heading first-column-width="9">
            <h1 class="break-word">
                {{ title || $t("view_address_detail.title") }}
                <strong>{{ $route.params.id }}</strong>
                <f-copy-button :text="$route.params.id" class="btn light large same-size round" />
            </h1>
        </f-view-heading>
        <f-address-detail
            v-if="isAddress"
            :id="$route.params.id"
            @is-contract="onIsContract"
            @is-address="onIsAddress"
        ></f-address-detail>
        <f-contract-detail v-if="!isAddress" :id="$route.params.id" />
    </div>
</template>

<script>
import FViewHeading from "../components/FViewHeading.vue";
import FAddressDetail from "../layouts/FAddressDetail.vue";
import FContractDetail from "../layouts/FContractDetail.vue";
import FCopyButton from "../components/core/FCopyButton/FCopyButton.vue";

export default {
    components: {
        FCopyButton,
        FContractDetail,
        FViewHeading,
        FAddressDetail
    },

    data() {
        return {
            title: "",
            isAddress: true,
        };
    },

    methods: {
        onIsContract() {
            this.title = this.$t("contract");
            this.isAddress = false;
        },

        onIsAddress() {
            this.title = "";
        }
    }
};
</script>

<style lang="scss">
.address-detail {
    h1 {
        strong {
            font-size: 21px;
            font-weight: normal;
            padding-left: 8px;
        }

        .f-copy-button {
            margin-left: 4px;
        }
    }
}
</style>
