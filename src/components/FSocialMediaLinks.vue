<template>
    <ul class="f-social-media-links no-markers">
        <li>
            <a href="https://twitter.com/FantomFDN" target="_blank" rel="nofollow">
                <icon data="@/assets/svg/social-media/twitter.svg" width="24" height="24"></icon>
            </a>
        </li>
        <li>
            <a href="https://www.reddit.com/r/FantomFoundation/" target="_blank" rel="nofollow">
                <icon data="@/assets/svg/social-media/reddit.svg" width="24" height="24"></icon>
            </a>
        </li>
        <li>
            <a href="https://github.com/Fantom-Foundation" target="_blank" rel="nofollow">
                <icon data="@/assets/svg/social-media/github.svg" width="24" height="24"></icon>
            </a>
        </li>
        <li>
            <a href="https://t.me/Fantom_English" target="_blank" rel="nofollow">
                <icon data="@/assets/svg/social-media/telegram.svg" width="24" height="24"></icon>
            </a>
        </li>
        <li>
            <a href="https://medium.com/fantomfoundation" target="_blank" rel="nofollow">
                <icon data="@/assets/svg/social-media/medium.svg" width="24" height="24"></icon>
            </a>
        </li>
        <li>
            <a href="https://www.linkedin.com/company/fantom-foundation/" target="_blank" rel="nofollow">
                <icon data="@/assets/svg/social-media/linkedin.svg" width="24" height="24"></icon>
            </a>
        </li>
    </ul>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-social-media-links {
        color: $secondary-color-lighter;

        li {
            display: inline-block;
            vertical-align: middle;

            &:not(:last-child) {
                padding-right: 24px;
            }

            @include links() {
                color: inherit;
                transition: color $transition-length ease;
            }

            a:not(.btn):hover {
                color: #fff;
            }
        }
    }
</style>
