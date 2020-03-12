<template>
    <div class="view-home narrow-container">
        <div class="row">
            <div class="col-8 offset-2 col-10-lg offset-1-lg col-12-sm no-offset-sm">
                <f-search-box></f-search-box>
            </div>
        </div>

        <div class="row row-2-cols-lg no-collapse equal-height">
            <div class="col">
                <router-link :to="{name: 'blocks'}" class="no-effect">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.blocks') }} <icon data="@/assets/svg/angle-right.svg" color="#999"></icon></h2>
                        <div class="num">73968</div>
                    </f-card>
                </router-link>
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
                <router-link :to="{name: 'transactions'}" class="no-effect">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.transactions') }} <icon data="@/assets/svg/angle-right.svg" color="#999"></icon></h2>
                        <div class="num">563900</div>
                    </f-card>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";
    import FSearchBox from "../components/FSearchBox.vue";

    export default {
        components: {
            FCard,
            FSearchBox
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .view-home {
        .f-search-box {
            width: 100%;
            padding: 64px 0;
        }

        .home-block {
            h2 {
                text-align: center;
                margin-top: 16px;
                margin-bottom: 4px;
            }

            .num {
                text-align: center;
                font-weight: bold;
                font-size: $fs48;
            }
        }
    }

    @include media-max($bp-menu) {
        .view-home {
            .f-search-box {
                padding: 32px 0;
            }
        }
    }

    @include media-max($bp-small) {
        .view-home {
            .home-block {
                h2 {
                    font-size: $fs16;
                }

                .num {
                    font-size: $fs36;
                }
            }
        }
    }
</style>
