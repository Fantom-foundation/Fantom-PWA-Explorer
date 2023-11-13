<template>
    <ul class="socialmedialinks no-markers">
        <li>
            <a href="https://twitter.com/FantomFDN" target="_blank" rel="nofollow" title="Fantom on Twitter">
                <icon data="@/assets/svg/social-media2/x.svg" width="32" height="32"></icon>
                <span class="socialmedialinks_label">Twitter</span>
            </a>
        </li>
        <li>
            <a href="http://chat.fantom.network/" target="_blank" rel="nofollow" title="Fantom on Discord">
                <icon data="@/assets/svg/social-media2/discord.svg" width="32" height="32"></icon>
                <span class="socialmedialinks_label">Discord</span>
            </a>
        </li>
        <li>
            <a href="https://t.me/Fantom_English" target="_blank" rel="nofollow" title="Fantom on Telegram">
                <icon data="@/assets/svg/social-media2/telegram.svg" width="32" height="32"></icon>
                <span class="socialmedialinks_label">Telegram</span>
            </a>
        </li>
        <li>
            <a href="https://www.reddit.com/r/FantomFoundation/" target="_blank" rel="nofollow" title="Fantom on Reddit">
                <icon data="@/assets/svg/social-media2/reddit.svg" width="32" height="32"></icon>
                <span class="socialmedialinks_label">Reddit</span>
            </a>
        </li>
        <li>
            <a href="https://github.com/Fantom-Foundation" target="_blank" rel="nofollow" title="Fantom on Github">
                <icon data="@/assets/svg/social-media/github.svg" width="32" height="32"></icon>
                <span class="socialmedialinks_label">Github</span>
            </a>
        </li>
    </ul>
</template>

<style lang="scss">
.socialmedialinks {
    display: flex;
    justify-content: space-between;

    margin-top: -20px;
    padding: 0 20px 20px !important;

    &_label {
        padding-left: 10px;
    }
}

@include media-max($bp-medium) {
    .socialmedialinks {
        &_label {
            display: none;
        }
    }
}
</style>
