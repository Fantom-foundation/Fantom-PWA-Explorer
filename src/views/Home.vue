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
                        <div class="num">{{ cBlocksCount | formatHexToInt }}</div>
                    </f-card>
                </router-link>
            </div>
            <div class="col">
                <router-link :to="{name: 'staking'}" class="no-effect">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.validators') }} <icon data="@/assets/svg/angle-right.svg" color="#999"></icon></h2>
                        <div class="num">{{ cValidatorsCount | formatHexToInt }}</div>
                    </f-card>
                </router-link>
            </div>
            <div class="col">
                <f-card class="home-block">
                    <h2 class="h3">{{ $t('view_home.accounts') }}</h2>
                    <div class="num">{{ cAccountsCount | formatHexToInt }}</div>
                </f-card>
            </div>
            <div class="col">
                <router-link :to="{name: 'transactions'}" class="no-effect">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.transactions') }} <icon data="@/assets/svg/angle-right.svg" color="#999"></icon></h2>
                        <div class="num">{{ cTransactionsCount | formatHexToInt }}</div>
                    </f-card>
                </router-link>
            </div>
        </div>
        <div class="row row-2-cols-lg equal-height">
            <div class="col">
                <f-card class="half-padding">
                    <h2 class="h3">Latest Blocks</h2>
                    <f-block-list f-card-off :mobile-view="true" :hidden-columns="['time', 'fee']" :infinite-scroll="false" height="300px" :items-per-page="10" class="home-table" />
                    <router-link :to="{name: 'blocks'}" class="btn small secondary" style="width: 100%;">
                        View all blocks
                    </router-link>
                </f-card>
            </div>
            <div class="col">
                <f-card class="half-padding">
                    <h2 class="h3">Latest Transactions</h2>
                    <f-transaction-list f-card-off :mobile-view="true" :hidden-columns="['gasUsed']" :infinite-scroll="false" height="300px" :items-per-page="10" class="home-table" />
                    <router-link :to="{name: 'transactions'}" class="btn small secondary" style="width: 100%;">
                        View all transactions
                    </router-link>
                </f-card>
            </div>
        </div>
<!--        <div class="row row-2-cols-lg equal-height">
            <div class="col">
                <f-card class="half-padding">
                    <h2 class="h3">Transaction Volumes</h2>
                    <f-lightweight-charts
                        ref="chart"
                        :series="volumeSeries"
                        series-type="histogram"
                        :series-options="{ priceFormat: { type: 'volume' } }"
                        __transform-values="to-eth"
                        time-to-timestamp
                        :height="280"
                        :options="{handleScroll: true,handleScale: true }"
                    />
                </f-card>
            </div>
        </div>-->
    </div>
</template>

<script>
    import FCard from "../components/core/FCard/FCard.vue";
    import FSearchBox from "../components/FSearchBox.vue";
    import gql from 'graphql-tag';
    import FBlockList from "@/data-tables/FBlockList.vue";
    import FTransactionList from "@/data-tables/FTransactionList.vue";

    export default {
        components: {
            FTransactionList,
            FBlockList,
            FCard,
            FSearchBox
        },

        apollo: {
            state: {
                query: gql`
                    query State {
                        state {
                            blocks
                            transactions
                            accounts
                            validators
                            sfcLockingEnabled
                            sealedEpoch {
                                id
                                totalSupply
                                baseRewardPerSecond
                            }
                        }
                    }
                `
            },
        },

        data() {
            return {
                volumeSeries: [],
            }
        },

        computed: {
            cBlocksCount() {
                return (this.state ? this.state.blocks : 0);
            },

            cValidatorsCount() {
                return (this.state ? this.state.validators : 0);
            },

            cAccountsCount() {
                return (this.state ? this.state.accounts : 0);
            },

            cTransactionsCount() {
                return (this.state ? this.state.transactions : 0);
            }
        },

        mounted() {
            this.volumeSeries = [
                {
                    time: '2021-04-10',
                    value: 10000,
                },
                {
                    time: '2021-04-11',
                    value: 20000,
                },
                {
                    time: '2021-04-12',
                    value: 10500,
                },
                {
                    time: '2021-04-13',
                    value: 16000,
                },
                {
                    time: '2021-04-14',
                    value: 1000,
                },
                {
                    time: '2021-04-15',
                    value: 10000,
                },
                {
                    time: '2021-04-16',
                    value: 10000,
                },
                {
                    time: '2021-04-17',
                    value: 10000,
                },
            ];

/*            setInterval(() => {
                this.volumeSeries[this.volumeSeries.length - 1].value += 100;
                this.$refs.chart._series.series.update({time: '2021-04-17', value: this.volumeSeries[this.volumeSeries.length - 1].value});
            }, 500);*/
        }
    }
</script>

<style lang="scss">
    .view-home {
        .f-search-box {
            width: 100%;
            padding: 32px 0 64px 0;
            //padding: 64px 0;
        }

        .home-block {
            min-height: 195px;

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

        .home-table {
            margin-bottom: 16px;
            height: 300px;
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
