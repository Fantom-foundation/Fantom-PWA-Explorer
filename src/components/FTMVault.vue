<template>
    <div class="ftmvault">
        <FTMVaultBox :amount="available" :title="`${$t('ftmVault.available')} (FTM)`" :ftm-price="ftmPrice" />
        <FTMVaultBox :amount="collected" :title="`${$t('ftmVault.collected')} (FTM)`" :ftm-price="ftmPrice" />
        <FTMVaultBox :amount="cPaidOut" :title="`${$t('ftmVault.paidOut')} (FTM)`" :ftm-price="ftmPrice" />
    </div>
</template>

<script>
import {pollingMixin} from "@/mixins/polling.js";
import gql from "graphql-tag";
import {formatHexToInt, timestampToDate} from "@/filters.js";
import FTMVaultBox from "@/components/FTMVaultBox.vue";
import {VAULT_CONTRACT_ADDRESS} from "@/utils/constants.js";
import {toBigNumber, toHex} from "@/utils/big-number.js";

export default {
    name: "FTMVault",
    components: {FTMVaultBox},

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
            available: '0x0',
            collected: '0x0',
            blocks: [],
        }
    },

    computed: {
        ftmPrice() {
            return this.$store.state.tokenPrice;
        },

        cPaidOut() {
            const bPaidOut = toBigNumber(this.collected).minus(this.available);

            return bPaidOut.toNumber() < 0 || this.available === '0x0' ? '0x0' : toHex(bPaidOut);
        }
    },

    mounted() {
        this.updateCollected();
        this.updateAvailable();

        this._polling.start(
            'update-ftm-vault-collected',
            () => {
                this.updateCollected();
            },
            10000
        );

        this._polling.start(
            'update-ftm-vault-available',
            () => {
                this.updateAvailable();
            },
            10000
        );
    },

    methods: {
        async updateCollected() {
            this.collected = await this.getFtmTreasuryTotalAmount();

            // tmp
            // this.collected = this.available;
        },

        async updateAvailable() {
            this.available = await this.getAvailable();

            // tmp
            // this.collected = this.available;
        },

        /**
         * @returns {Promise<Array>}
         */
        async getFtmTreasuryTotalAmount() {
            const data = await this.$apollo.query({
                query: gql`
                    query GetFtmTreasuryTotalAmount {
                        ftmTreasuryTotal
                    }
                `,
                fetchPolicy: 'network-only',
            });

            return data.data && data.data.ftmTreasuryTotal || '0x0';
        },

        async getAvailable(address = VAULT_CONTRACT_ADDRESS) {
            const data = await this.$apollo.query({
                query: gql`
                    query GetAccountBalance($address: Address!) {
                        account(address: $address) {
                            balance
                        }
                    }
                `,
                variables: { address },
                fetchPolicy: 'network-only',
            });

            return data.data && data.data.account.balance || '0x0';
        },

        timestampToDate,
        formatHexToInt,
    }
}
</script>

<style lang="scss">
.ftmvault {
    width: 100%;

    display: flex;
    gap: 20px;

    > * {
        flex: 1;
    }
}

@include media-max($bp-large) {
    .ftmvault {
        flex-direction: column;
    }
}
</style>
