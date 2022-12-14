<template>
<div class="rewardsestimation">
    <div class="rewardsestimation_row">
        <h3 id="rew_est_sl1">Your stake <span class="rewardsestimation_highlighted">{{ formatNumberByLocale(stake, 0) }} FTM</span></h3>
        <FSlider
            name="stake"
            v-model="stake"
            use-lower-fill-bar
            aria-labelledby="rew_est_sl1"
            min="10"
            max="2000000"
            :labels="['10', '2000000']"
            clickable-labels
        />
    </div>
    <div class="rewardsestimation_row">
        <h3 id="rew_est_sl2">Locking it for <span class="rewardsestimation_highlighted">{{ formatNumberByLocale(lock, 0) }} days</span></h3>
        <FSlider
            name="lock"
            v-model="lock"
            use-lower-fill-bar
            aria-labelledby="rew_est_sl2"
            :min="minLock"
            max="365"
            :labels="['min lock', 'max lock']"
            clickable-labels
        />
    </div>
    <div class="rewardsestimation_rewards">
        <div>
            <h3>Your estimated rewards</h3>
            <div class="rewardsestimation_highlighted">
                <template v-if="yApr > 0">{{ formatNumberByLocale(rewards, 0) }} FTM</template>
                <template v-else>-</template>
            </div>
        </div>
        <div>
            <h3>Current APR</h3>
            <div class="rewardsestimation_highlighted">
                <template v-if="yApr > 0">{{ formatNumberByLocale(apr * 100, 2) }}%</template>
                <template v-else>-</template>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import gql from "graphql-tag";
import {cloneObject, toHex, toInt} from "@/utils/index.js";
import FSlider from "@/components/core/FSlider/FSlider.vue";
import {formatNumberByLocale} from "@/filters.js";

export default {
    name: "RewardsEstimation",

    components: {FSlider},

    data() {
        return {
            stake: '2000000',
            lock: '365',
            yApr: 0,
            minLock: '14',
        }
    },

    computed: {
        rewards() {
            const lock = parseInt(this.lock);
            const stake = parseInt(this.stake);

            return stake * (this.apr / 365 * lock);
        },

        apr() {
            const lock = parseInt(this.lock);
            // const minLock = parseInt(this.minLock);
            // const lockP = (lock - minLock) / (365 - minLock);
            const lockP = lock / 365;
            const noLockP = 30;

            return ((lockP * (100 - noLockP) + noLockP) / 100) * this.yApr;
        }
    },

    mounted() {
        this.loadVariables();
    },

    methods: {
        async loadVariables() {
            const data = await this.getRewardsEstimation(1000000);

            this.yApr = toInt(data.yearlyReward) / 1000000;
        },

        async getRewardsEstimation(amount = 1000000) {
            const data = await this.$apollo.query({
                query: gql`
                    query GetRewardsEstimation($amount:Long) {
                        estimateRewards(amount: $amount) {
                            yearlyReward
                        }
                    }
                `,
                variables: {
                    amount: toHex(amount),
                },
                fetchPolicy: 'network-only',
            });

            return cloneObject(data.data && data.data.estimateRewards || {});
        },

        formatNumberByLocale,
    }
}
</script>

<style lang="scss">
.rewardsestimation {
    h3 {
        font-weight: normal;
    }

    &_row {
        padding-bottom: 48px;
    }

    &_rewards {
        display: flex;
        justify-content: space-between;

        h3 {
            margin-bottom: 0;
        }
    }

    &_highlighted {
        font-size: 21px;
        color: var(--f-primary-color);
        font-weight: 600;
    }

    .f-slider {
        .labels {
            > div {
                > * {
                    > span {
                        transform: translateX(-12%);
                        opacity: 0.61;
                    }

                    &:last-child > span {
                        transform: translateX(-85%);
                    }
                }
            }
        }
    }
}
</style>
