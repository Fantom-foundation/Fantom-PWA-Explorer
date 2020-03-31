<template>
    <div class="address-detail narrow-container">
        <f-view-heading first-column-width="9">
            <h1 class="break-word">{{ $t('view_address_detail.title') }} <strong>{{ $route.params.id }}</strong></h1>
        </f-view-heading>
        <f-address-detail :id="$route.params.id"></f-address-detail>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FAddressDetail from "../layouts/FAddressDetail.vue";

    export default {
        components: {
            FViewHeading,
            FAddressDetail
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .address-detail {
        h1 {
            strong {
                font-size: 21px;
                font-weight: normal;
                padding-left: 8px;
            }
        }
    }
</style>
