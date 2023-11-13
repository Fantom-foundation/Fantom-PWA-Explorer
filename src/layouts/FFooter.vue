<template>
    <footer class="f-footer">
        <div class="narrow-container">
            <social-media-links />
        </div>
    </footer>
</template>

<script>
    import SocialMediaLinks from "@/components/SocialMediaLinks.vue";

    export default {
        components: {
            SocialMediaLinks,
        }
    }
</script>

<style lang="scss">
    .f-footer {
        //--f-footer-background-color: #{$theme-color};
        --f-footer-link-color: #{$theme-color};

        color: #fff;
        //background-color: var(--f-footer-background-color);
        //min-height: 64px;

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
            transition: opacity $transition-length ease;
        }

        a:not(.btn):hover {
            text-decoration: none;
            opacity: 0.5;
        }
    }
</style>
