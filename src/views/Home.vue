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
        <div class="row equal-height mat-5">
            <div class="col">
                <f-card class="half-padding">
                    <div class="txvolumes_label">
                        <h2 class="h3" id="txv">Daily Transactions</h2>
                        <f-listbox v-model="txVolumesResolution" :focus-item-on-focus="true" :data="txVolumesResolutions" labeled-by="txv" horizontal />
                    </div>
                    <transaction-volumes :resolution="txVolumesResolution" />
                </f-card>
            </div>
        </div>
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
    import TransactionVolumes from "@/components/TransactionVolumes.vue";
    import FListbox from "@/components/core/FListbox/FListbox.vue";
    import {formatNumberByLocale} from "@/filters.js";

    export default {
        mixins: [pollingMixin],

        components: {
            FListbox,
            TransactionVolumes,
            HomeTransactionList,
            HomeBlockList,
            FCard,
            FSearchBox,
            AnimatedNumber
        },

        data() {
            return {
                blocksData: [],
                txVolumesResolution: '1m',
                txVolumesResolutions: [
                    {
                        label: '2 Weeks',
                        value: '14d',
                    },
                    {
                        label: '1 Month',
                        value: '1m',
                    },
                    {
                        label: '3 Months',
                        value: '3m',
                    },
                ],
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
                    this.updateChainState();
                },
                3300
            );
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
                return formatNumberByLocale(parseInt(_num), 0);
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
            --f-card-padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;

            min-height: 195px;

            h2 {
                text-align: center;
                //margin-top: 16px;
                margin-bottom: 4px;
            }

            .num {
                text-align: center;
                font-weight: bold;
                font-size: 38px;
            }
        }

        .home-table {
            margin-bottom: 16px;
            height: 300px;
        }

        .txvolumes_label {
            display: flex;
            flex-wrap: wrap;
            //gap: 16px;
            align-items: center;
            margin-bottom: 4px;

            h2 {
                margin-bottom: 0;
                padding-inline-end: 16px;
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
                min-height: 136px;

                h2 {
                    font-size: $fs16;
                }

                .num {
                    font-size: 28px;
                }
            }

            .txvolumes_label {
                //font-size: 14px;
                h2 {
                    margin-bottom: 8px;
                }
            }
        }
    }
</style>
