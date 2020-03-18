<template>
    <div class="view-not-found center-v-h">
        <div class="message">
            <h1 class="h4">{{ $t('view_not_found.title') }}</h1>
            {{ $t('view_not_found.text') }}

            <router-link :to="{name: 'home'}" class="router-link">{{  $t('view_not_found.link_title') }}</router-link>
        </div>
    </div>
</template>

<script>
    export default {
/*
        mounted() {
            setTimeout(() => {
                this.$router.replace({name: 'home'});
            }, 2000)
        }
*/
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .view-not-found {
        .message {
            width: 90%;
            max-width: 400px;
            padding: 24px 32px;
            border-radius: 8px;
            background-color: #fff;
            margin: 32px auto 0 auto;

            h1 {
                font-weight: bold;
                margin-top: 0;
                /*margin: 0;*/
            }

            .router-link {
                display: block;
                margin-top: 16px;
            }
        }
    }
</style>
