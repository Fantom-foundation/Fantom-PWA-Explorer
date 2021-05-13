<template>
    <div class="view-not-found center-v-h">
        <div class="message">
            <h1 class="h4">{{ $t('view_not_found.title') }}</h1>
            {{ $t('view_not_found.text') }} <br><br>
            {{ $t('view_not_found.text2') }}

            <router-link to="/" class="router-link">{{  $t('view_not_found.link_title') }}</router-link>
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
    .view-not-found {
        --view-not-found-background-color: #fff;

        .message {
            width: 90%;
            max-width: 400px;
            padding: 24px 32px;
            border-radius: 8px;
            background-color: var(--view-not-found-background-color);
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
