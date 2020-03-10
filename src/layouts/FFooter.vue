<template>
    <footer class="f-footer">
        <div class="narrow-container">
            <div class="row align-items-center">
                <div class="col align-center-sm"><f-social-media-links></f-social-media-links></div>
                <div class="col align-center-sm align-right">
                    <a href="https://fantom.foundation/" target="_blank" rel="nofollow">©2020 Fantom Foundation</a>
                </div>
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

        @include links() {
            color: $secondary-color-lighter;
            transition: color $transition-length ease;
        }

        a:not(.btn):hover {
            color: #fff;
            text-decoration: none;
        }
    }
</style>
