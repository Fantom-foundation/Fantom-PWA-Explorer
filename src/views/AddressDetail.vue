<template>
    <div class="narrow-container">
        <f-view-heading first-column-width="9" :title="$t('view_address_detail.title')"></f-view-heading>
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
