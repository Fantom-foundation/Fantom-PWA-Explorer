<template>
    <div class="narrow-container">
        <div class="row">
            <div class="col">
                <h1 class="h3">Test apollo/graphql</h1>
                <apollo-test-jobs-d-t></apollo-test-jobs-d-t>
            </div>
<!--
            <div class="col">
                <apollo-test-jobs-d-t></apollo-test-jobs-d-t>
            </div>
-->
        </div>
    </div>
</template>

<script>
    // import ApolloTestDT from "../data-tables/ApolloTestDT.vue";
    import ApolloTestJobsDT from "../data-tables/ApolloTestJobsDT.vue";

    export default {
        components: {
            ApolloTestJobsDT
        }
    }
</script>

<style lang="scss">
</style>
