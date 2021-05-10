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
                        <div class="num">
                            <animated-number
                                :value="chainState.blocks | formatHexToInt"
                                :formatValue="formatNum"
                                :duration="numAnimationDuration"
                            />
                        </div>
                    </f-card>
                </router-link>
            </div>
            <div class="col">
                <router-link :to="{name: 'staking'}" class="no-effect">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.validators') }} <icon data="@/assets/svg/angle-right.svg" color="#999"></icon></h2>
                        <div class="num">
                            <animated-number
                                :value="chainState.validators | formatHexToInt"
                                :formatValue="formatNum"
                                :duration="numAnimationDuration"
                            />
                        </div>
                    </f-card>
                </router-link>
            </div>
            <div class="col">
                <f-card class="home-block">
                    <h2 class="h3">{{ $t('view_home.accounts') }}</h2>
                    <div class="num">
                        <animated-number
                            :value="chainState.accounts | formatHexToInt"
                            :formatValue="formatNum"
                            :duration="numAnimationDuration"
                        />
                    </div>
                </f-card>
            </div>
            <div class="col">
                <router-link :to="{name: 'transactions'}" class="no-effect">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.transactions') }} <icon data="@/assets/svg/angle-right.svg" color="#999"></icon></h2>
                        <div class="num">
                            <animated-number
                                :value="chainState.transactions | formatHexToInt"
                                :formatValue="formatNum"
                                :duration="numAnimationDuration"
                            />
                        </div>
                    </f-card>
                </router-link>
            </div>
        </div>
        <div class="row row-2-cols-lg equal-height mat-5">
            <div class="col">
                <f-card class="half-padding">
                    <h2 class="h3">Latest Blocks</h2>
                    <home-block-list :items="blocksData" :hidden-columns="['time', 'fee']" :items-per-page="10" class="home-table" />
                    <router-link :to="{name: 'blocks'}" class="btn small secondary" style="width: 100%;">
                        View all blocks
                    </router-link>
                </f-card>
            </div>
            <div class="col">
                <f-card class="half-padding">
                    <h2 class="h3">Latest Transactions</h2>
                    <home-transaction-list :items="blocksData" :hidden-columns="['gasUsed']" :items-per-page="5" class="home-table" />
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
    import HomeBlockList from "@/data-tables/HomeBlockList.vue";
    import HomeTransactionList from "@/data-tables/HomeTransactionList.vue";
    import AnimatedNumber from "animated-number-vue";
    import {pollingMixin} from "@/mixins/polling.js";

    export default {
        mixins: [pollingMixin],

        components: {
            HomeTransactionList,
            HomeBlockList,
            FCard,
            FSearchBox,
            AnimatedNumber
        },

        data() {
            return {
                blocksData: [],
                volumeSeries: [],
                numAnimationDuration: 750,
                chainState: {
                    blocks: 0,
                    validators: 0,
                    accounts: 0,
                    transactions: 0,
                },
            }
        },

        created() {
            this.updateChainState();
        },

        mounted() {
            this._polling.start(
                'update-net-state',
                () => {
                    if (this.$store.state.pageVisible) {
                        this.updateChainState();
                    }
                },
                3300
            );

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
                    value: 14300,
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
        },

        methods: {
            async updateChainState() {
                this.chainState = {...await this.fetchState()};

            },

            /**
             * @returns {Promise<Object>}
             */
            async fetchState() {
                const data = await this.$apollo.query({
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
                    `,
                    fetchPolicy: 'network-only',
                });

                return data.data.state || {};
            },

            formatNum(_num) {
                return parseInt(_num);
            }
        }
    }
</script>

<style lang="scss">
    .view-home {
        .f-search-box {
            width: 100%;
            padding: 8px 0 40px 0;
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
