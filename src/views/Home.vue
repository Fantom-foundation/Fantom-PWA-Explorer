<template>
    <div class="view-home">
        <div class="narrow-container">
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

            <div v-if="showNetworkNodesMap" class="row mat-5">
                <div class="col">
                    <f-card class="half-padding">
                        <h2 class="h3">
                            {{ $t('view_home.fantom_mainnet_nodes') }}
                            <f-info show-on-hover button-tooltip="" window-class="light" window-style="max-width: 350px;">
                                All RPC, read-only and validator nodes synced to Fantom Opera Mainnet.
                            </f-info>
                        </h2>
                        <network-nodes-map />
                    </f-card>
                </div>
            </div>

            <div class="row row-2-cols-lg equal-height mat-5 view-home_latestblocks">
                <div class="col">
                    <div class="view-home_block">
                        <h2 class="h3">
                            {{ $t('view_home.latest_blocks') }}
                            <router-link :to="{name: 'blocks'}">
                                All blocks
                            </router-link>
                        </h2>
                        <home-block-list :items="blocksData" :items-per-page="5" class="home-table" />
                    </div>
                </div>
                <div class="col">
                    <div class="view-home_block">
                        <h2 class="h3">
                            {{ $t('view_home.latest_transactions') }}
                            <router-link :to="{name: 'transactions'}">
                                {{ $t('view_home.view_all_transactions') }}
                            </router-link>
                        </h2>
                        <home-transaction-list :items="blocksData" :items-per-page="5" class="home-table" />
                    </div>
                </div>
            </div>


            <div class="row equal-height mat-5">
                <div class="col">
                    <TransactionVolumes resolution="3m" />
                </div>
            </div>

            <div v-if="showDailyBlocks" class="row mat-5">
                <div class="col">
                    <DailyBlocks resolution="3m" />
                </div>
            </div>

            <div v-if="showDailyTxFees" class="row mat-5">
                <div class="col">
                    <DailyTxFees resolution="3m" />
                </div>
            </div>
            <div v-if="showFTMVault" class="row mat-5">
                <div class="col">
                    <h2 class="h3 home_h2">
                        {{ $t('view_home.vault') }}
                        <f-info show-on-hover button-tooltip="" window-class="light" window-style="max-width: 350px;">
                            The Ecosystem Vault collects <span class="number">10%</span> of all transaction fees paid to the network.
                            The next phase of the Vault is coming soon!
                            Stay tuned and meanwhile explore the successes of its most recent distribution winners.
                        </f-info>
                    </h2>
                    <FTMVault />
                </div>
            </div>
            <div class="row mat-5">
                <div class="col">
                    <h2 class="h3 home_h2">
                        {{ $t('view_home.total_ftm_burned') }}
                        <f-info show-on-hover button-tooltip="" window-class="light" window-style="max-width: 350px;">
                            <span class="number">70%</span> of the fees paid to the network
                            are allocated to validators; <span class="number">15%</span> supports the <strong>GasM</strong> program,
                            <span class="number">10%</span> bolsters the <strong>Ecosystem Vault</strong>, and the remaining
                            <span class="number">5%</span> is permanently burnt.
                        </f-info>
                    </h2>
                    <BurnedFTM />
                </div>
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
    import {formatNumberByLocale} from "@/filters.js";
    import BurnedFTM from "@/components/BurnedFTM.vue";
    import appConfig from '../../app.config.js';
    import NetworkNodesMap from "@/components/NetworkNodesMap.vue";
    import FInfo from "@/components/core/FInfo/FInfo.vue";
    import FTMVault from "@/components/FTMVault.vue";
    import DailyBlocks from "@/components/DailyBlocks.vue";
    import DailyTxFees from "@/components/DailyTxFees.vue";

    export default {
        mixins: [pollingMixin],

        components: {
            DailyTxFees,
            DailyBlocks,
            FTMVault,
            FInfo,
            NetworkNodesMap,
            BurnedFTM,
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
                showNetworkNodesMap: appConfig.flags.networkNodesMap,
                showFTMVault: appConfig.flags.ftmVault,
                showDailyBlocks: appConfig.flags.dailyBlocks,
                showDailyTxFees: appConfig.flags.dailyTxFees,
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
                5800
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
        overflow-x: hidden;

        &_block {
            margin-bottom: -16px;

            h2 {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                margin-bottom: 4px;

                a {
                    font-size: 14px;
                    font-weight: normal;
                }
            }
        }

        &_latestblocks {
           margin-bottom: 16px;
        }

        .home_h2 {
            margin-bottom: 12px;
        }

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
            //margin-bottom: 16px;
            //height: 300px;
        }

        .f-info {
            margin-top: -2px;
            margin-inline-start: 8px;
        }
    }

    @include media-max(1150px) {
        .view-home {
            &_latestblocks {
                flex-direction: column;

                > .col {
                    max-width: 100%;
                }
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
            &_block {
                h2 {
                    margin-bottom: 8px;
                }
            }

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
