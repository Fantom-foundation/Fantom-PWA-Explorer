<template>
    <footer class="f-footer">
        <div class="narrow-container">
            <div class="row align-items-center">
                <div class="col align-center-sm"><f-social-media-links></f-social-media-links></div>
                <div class="col align-center-sm copyright">©2020 Fantom Foundation</div>
            </div>
        </div>
    </footer>
</template>

<script>
    import FSocialMediaLinks from "../components/FSocialMediaLinks.vue";

    export default {
        components: {
            FSocialMediaLinks
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

        .copyright {
            color: #a0bffd;
            text-align: right;
        }
    }
</style>
