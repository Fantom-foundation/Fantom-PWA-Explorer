<template>
    <span class="f-account-t-amount" :class="cClass">
        <template v-if="!cIsZero"><template v-if="cReceived">+</template><template v-else>-</template></template>
        <f-token-value :value="amount" :decimals="2" :use-placeholder="false" no-currency />
    </span>
</template>

<script>
    import FTokenValue from "@/components/core/FTokenValue/FTokenValue.vue";

    // formatter for account transaction amount
    export default {
        components: {FTokenValue},
        props: {
            // account address
            address: {
                type: String,
                default: ''
            },
            // transaction's 'from' address
            from: {
                type: String,
                default: ''
            },
            // transaction's 'to' address
            to: {
                type: String,
                default: ''
            },
            // transaction's amount
            amount: {
                type: [String, Number],
                default: ''
            },
            // zero amount
            zero: {
                type: String,
                default: '0.00'
            }
        },

        computed: {
            cReceived() {
                return (this.address.toLocaleLowerCase() === this.to.toLocaleLowerCase());
            },

            cIsZero() {
                return this.amount === 0;
            },

            cClass() {
                let clas = '';

                if (!this.cIsZero) {
                    clas = (this.cReceived ? 'received' : 'sent');
                }

                return clas;
            }
        }
    }
</script>

<style lang="scss">
    .f-account-t-amount {
        font-weight: bold;
        &.received {
            color: #0ebec2;
        }

        .f-token-value {
            margin-inline-start: -4px;
        }
    }
</style>
