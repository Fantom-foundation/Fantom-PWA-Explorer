<template>
    <div class="narrow-container">
        <f-view-heading first-column-width="9" :title="$t('view_validator_detail.title')"></f-view-heading>
        <f-validator-detail :address="$route.params.address"></f-validator-detail>
    </div>
</template>

<script>
    import FViewHeading from "../components/FViewHeading.vue";
    import FValidatorDetail from "../layouts/FValidatorDetail.vue";

    export default {
        components: {
            FViewHeading,
            FValidatorDetail
        }
    }
</script>
