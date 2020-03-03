<template>
    <div class="not-found-page center-v-h">
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

    .not-found-page {
        .message {
            width: 90%;
            max-width: 400px;
            padding: 1.5rem 2rem;
            border-radius: 0.5rem;
            background-color: #fff;
            margin: 2rem auto 0 auto;

            h1 {
                font-weight: bold;
                margin-top: 0;
                /*margin: 0;*/
            }

            .router-link {
                display: block;
                margin-top: 1rem;
            }
        }
    }
</style>
