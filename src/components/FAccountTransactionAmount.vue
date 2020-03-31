<template>
    <span class="f-account-t-amount" :class="cClass">
        <template v-if="!cIsZero"><template v-if="cRecieved">+</template><template v-else>-</template></template>{{ amount }}
    </span>
</template>

<script>
    // formatter for account transaction amount
    export default {
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
                type: String,
                default: ''
            },
            // zero amount
            zero: {
                type: String,
                default: '0.00'
            }
        },

        computed: {
            cRecieved() {
                return (this.address === this.to);
            },

            cIsZero() {
                return (this.amount === this.zero);
            },

            cClass() {
                let clas = '';

                if (!this.cIsZero) {
                    clas = (this.cRecieved ? 'recieved' : 'sent');
                }

                return clas;
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/vars";

    .f-account-t-amount {
        font-weight: bold;
        &.recieved {
            color: #0ebec2;
        }
    }
</style>
