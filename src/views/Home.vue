<template>
    <div class="narrow-container">
        <div class="row">
            <div class="col-8 offset-2 col-10-lg offset-1-lg col-12-sm no-offset-sm">
                <div class="search-input">
                    <input type="text" name="search" class="large" :placeholder="$t('view_home.search_input_placeholder')">
                </div>
            </div>
        </div>

        <div class="row row-2-cols-lg no-collapse equal-height">
            <div class="col">
                <f-card class="home-block">
                    <h2 class="h3">{{ $t('view_home.blocks') }}</h2>
                    <div class="num">73968</div>
                </f-card>
            </div>
            <div class="col">
                <f-card class="home-block">
                    <h2 class="h3">{{ $t('view_home.validators') }}</h2>
                    <div class="num">32</div>
                </f-card>
            </div>
            <div class="col">
                <f-card class="home-block">
                    <h2 class="h3">{{ $t('view_home.accounts') }}</h2>
                    <div class="num">4546</div>
                </f-card>
            </div>
            <div class="col">
                <router-link to="/transactions" class="no-effect">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.transactions') }}</h2>
                        <div class="num">563900</div>
                    </f-card>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";

    export default {
        components: {
            FCard
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .search-input {
        padding: 64px 0;
        text-align: center;

        input:not(.def):not([type=submit]).large {
            width: 100%;
            height: 3.5rem;
            border-radius: 3.5rem !important;
            box-shadow: $elev3-shadow;
        }
    }

    .home-block {
        h2 {
            text-align: center;
        }

        .num {
            text-align: center;
            font-weight: bold;
            font-size: $fs48;
        }
    }

    @include media-max($bp-small) {
        .search-input {
            padding: 48px 0;
        }

        .home-block {
            h2 {
                font-size: $fs16;
            }

            .num {
                font-size: $fs36;
            }
        }
    }
</style>
