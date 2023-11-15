<template>
    <div class="burnedftm">
        <div class="burnedftm_left">
            <p class="burnedftm_amount number">{{ cTotalBurned }} <span class="burnedftm_ftm">FTM</span></p>
        </div>

        <template v-if="blocks.length > 0">
            <ul class="no-markers" @click="onClick">
                <li v-for="block in blocks" :key="block.blockNumber" class="burnedftm_block" :class="{ 'burnedftm_block-animate': block.__animate__ }" :data-blocknumber="formatHexToInt(block.blockNumber)">
                    <div class="burnedftm_block_burned number">
                        <span class="fsvgicon">
                            <icon
                                data="@/assets/svg/fire.svg"
                                width="20"
                                height="20"
                                color="#1969ff"
                                aria-hidden="true"
                            />
                        </span>
                        <span>{{ block.ftmValue }}</span>
                    </div>
                    <div class="burnedftm_block_info">
                        Block {{ formatHexToInt(block.blockNumber) }} <br />
                    </div>
                </li>
            </ul>
        </template>
    </div>
</template>

<script>
import {pollingMixin} from "@/mixins/polling.js";
import gql from "graphql-tag";
import {cloneObject, defer} from "@/utils/index.js";
import {formatHexToInt, formatNumberByLocale, timestampToDate} from "@/filters.js";
import {getAttr} from "@/utils/DOM.js";

export default {
    name: "BurnedFTM",

    mixins: [pollingMixin],

    props: {
        /** Maximum amount of displayed blocks */
        maxBlocks: {
            type: Number,
            default: 3,
        },
    },

    data() {
        return {
            totalBurned: 0,
            blocks: [],
        }
    },

    computed: {
        tokenPrice() {
            return this.$store.state.tokenPrice;
        },

        cTotalBurned() {
            return formatNumberByLocale(this.totalBurned, 0);
        },
    },

    mounted() {
        setTimeout(() => {
            this.update();
        }, 3050);

        this._polling.start(
            'update-burned-ftm',
            () => {
                this.update();
            },
            5300
        );
    },

    methods: {
        async update() {
            this.totalBurned = await this.getFtmBurnedTotal();
            this.setBlocks(await this.getFtmLatestBlockBurnList());
        },

        setBlocks(newBlocks) {
            let blocks;
            let newBlocksLen = newBlocks.length;

            if (newBlocksLen > 0) {
                blocks = [...newBlocks, ...this.blocks];

                if (blocks.length > this.maxBlocks) {
                    blocks = blocks.slice(0, this.maxBlocks);
                }

                this.blocks = blocks;

                this.animateBlocks(newBlocksLen, this.blocks);
            }
        },

        animateBlocks(numBlocks, blocks) {
            defer(() => {
                const blocksLen = blocks.length;

                if (numBlocks > blocksLen) {
                    numBlocks = blocksLen;
                }

                for (let i = 0; i < numBlocks; i++) {
                    // blocks[i].__animate__ = true;
                    // blocks[i] = { ...blocks[i], __animate__: true };
                    this.$set(blocks[i], '__animate__', true);
                }
            }, 30);
        },

        /**
         * @returns {Promise<Array>}
         */
        async getFtmLatestBlockBurnList(count = this.maxBlocks) {
            const data = await this.$apollo.query({
                query: gql`
                    query GetFtmLatestBlockBurnList($count: Int = 25) {
                        ftmLatestBlockBurnList(count: $count) {
                            blockNumber
                            timestamp
                            ftmValue
                        }
                    }
                `,
                variables: {
                    count,
                },
                fetchPolicy: 'network-only',
            });

            return cloneObject(data.data && data.data.ftmLatestBlockBurnList || []);
        },

        /**
         * @returns {Promise<Array>}
         */
        async getFtmBurnedTotal() {
            const data = await this.$apollo.query({
                query: gql`
                    query GetFtmBurnedTotalAmount {
                        ftmBurnedTotalAmount
                    }
                `,
                fetchPolicy: 'network-only',
            });

            return data.data && data.data.ftmBurnedTotalAmount || 0;
        },

        onClick(event) {
            const li = event.target.closest('li');
            const blockNumber = parseInt(li ? getAttr(li, 'data-blocknumber') : '')

            if (!isNaN(blockNumber)) {
                this.$router.push({name: 'block-detail', params: {id: blockNumber}})
            }
        },

        timestampToDate,
        formatHexToInt,
    }
}
</script>

<style lang="scss">
.burnedftm {
    --burnedftm-transition-length: 610ms;
    --burnedftm-border-color: #e6e6e6;
    --burnedftm-block-hover-color: var(--f-color-primary-2, #ebf2ff);

    display: flex;
    align-items: center;

    &_left {
        text-align: center;
        flex: 0.8;
    }

    &_amount {
        font-size: 64px;
    }

    &_amount_usd {
        font-size: 32px;
    }

    &_ftm {
        color: $light-gray-color;
        font-size: 1.125rem;
    }

    ul {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--f-spacer-1);
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    &_block {
        display: flex;
        align-items: center;
        opacity: 0;
        padding: 10px 15px;
        transition: opacity var(--burnedftm-transition-length) ease;
        cursor: pointer;

        &:hover {
            background: var(--burnedftm-block-hover-color);
        }

        &-animate {
            opacity: 1;
        }

        > * {
            flex: 1;
        }

        &_burned {
            display: flex;
            justify-items: center;
            font-size: 20px;

            .fsvgicon {
                margin-top: -2px;
                margin-right: 3px;
            }
        }

        &_info {
            font-size: 16px;
            text-align: end;
            line-height: 1.15;
        }

        + .burnedftm_block {
            border-top: 1px solid var(--burnedftm-border-color);
        }
    }
}

@include media-max($bp-medium) {
    .burnedftm {
        flex-direction: column;

        &_left {
            flex: none;
            margin-bottom: 24px;
        }

        ul {
            width: 100%;
            flex: none;
        }

        &_amount {
            font-size: 50px;
            padding-bottom: 0;
        }

        &_amount_usd {
            font-size: 28px;
        }
    }
}
</style>
