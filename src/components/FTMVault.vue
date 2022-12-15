<template>
    <div class="ftmvault">
        <div class="ftmvault_left">
            <p class="ftmvault_amount number">{{ cAvailable }} <span class="ftmvault_ftm">FTM</span></p>
        </div>

        <template v-if="blocks.length > 0">
            <ul class="no-markers">
                <li v-for="block in blocks" :key="block.blockNumber" class="ftmvault_block" :class="{ 'ftmvault_block-animate': block.__animate__ }">
                    <div class="ftmvault_block_burned number">
                        <span class="fsvgicon">
                            <icon
                                data="@/assets/svg/fire.svg"
                                width="20"
                                height="20"
                                color="#ff711f"
                                aria-hidden="true"
                            />
                        </span>
                        <span>{{ block.ftmValue }}</span>
                    </div>
                    <div class="ftmvault_block_info">
                        Block {{ formatHexToInt(block.blockNumber) }} <br />
                        <timeago :datetime="timestampToDate(block.timestamp)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
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

export default {
    name: "FTMVault",

    mixins: [pollingMixin],

    props: {
        /** Maximum amount of displayed blocks */
        maxBlocks: {
            type: Number,
            default: 5,
        },
    },

    data() {
        return {
            available: 0,
            blocks: [],
        }
    },

    computed: {
        tokenPrice() {
            return this.$store.state.tokenPrice;
        },

        cAvailable() {
            return formatNumberByLocale(this.available, 0);
        },
    },

    mounted() {
        this.updateAvailable();

        this._polling.start(
            'update-ftm-vault-available',
            () => {
                this.updateAvailable();
            },
            10000
        );
    },

    methods: {
        async updateAvailable() {
            this.available = await this.getFtmTreasuryTotalAmount();
            // this.setBlocks(await this.getFtmLatestBlockBurnList());
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
        async getFtmTreasuryTotalAmount() {
            const data = await this.$apollo.query({
                query: gql`
                    query GetFtmTreasuryTotalAmount {
                        ftmTreasuryTotalAmount
                    }
                `,
                fetchPolicy: 'network-only',
            });

            return data.data && data.data.ftmTreasuryTotalAmount || 0;
        },

        timestampToDate,
        formatHexToInt,
    }
}
</script>

<style lang="scss">
.ftmvault {
    --ftmvault-transition-length: 610ms;
    --ftmvault-border-color: #e6e6e6;

    //display: flex;
    //align-items: center;

    &_left {
        text-align: center;
        //flex: 0.8;
        padding-bottom: 32px;
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
        transition: opacity var(--ftmvault-transition-length) ease;

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

        + .ftmvault_block {
            border-top: 1px solid var(--ftmvault-border-color);
        }
    }
}

@include media-max($bp-medium) {
    .ftmvault {
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
