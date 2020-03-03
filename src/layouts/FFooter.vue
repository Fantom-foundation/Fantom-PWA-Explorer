<template>
    <footer class="f-footer">
        <div class="narrow-container">
            FOOTER
        </div>
    </footer>
</template>

<script>
    export default {
        components: {
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-footer {
        color: #fff;
        background-color: $theme-color;

        .narrow-container {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }
    }
</style>
