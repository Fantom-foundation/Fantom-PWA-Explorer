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
    .f-footer {
        --f-footer-background-color: #{$theme-color};
        --f-footer-link-color: #{$secondary-color-lighter};

        color: #fff;
        background-color: var(--f-footer-background-color);
        min-height: 64px;

        .narrow-container {
            padding-top: 8px;
            padding-bottom: 8px;
            height: 100%;

            > .row {
                height: 100%;
            }
        }

        @include links() {
            color: var(--f-footer-link-color);
            transition: color $transition-length ease;
        }

        a:not(.btn):hover {
            color: #fff;
            text-decoration: none;
        }
    }
</style>
