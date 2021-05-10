<template>
    <div id="app">
        <f-header></f-header>
        <main>
            <!--        <img alt="Vue logo" src="./assets/logo.png">-->
<!--            <router-view :key="$route.path"></router-view>-->
            <router-view></router-view>
        </main>
        <f-footer></f-footer>

        <f-breakpoints>
            <f-breakpoint value="768px" code="menu-mobile"></f-breakpoint>
            <f-breakpoint value="600px" code="data-table-mobile-view"></f-breakpoint>
            <f-breakpoint value="940px" code="contract-list-dt-mobile-view"></f-breakpoint>
            <f-breakpoint value="1000px" code="transaction-list-dt-mobile-view"></f-breakpoint>
            <f-breakpoint value="1100px" code="validator-list-dt-mobile-view"></f-breakpoint>
        </f-breakpoints>
        <f-aria-alert />
    </div>
</template>

<script>
    import FBreakpoint from "./components/FBreakpoint.vue";
    import FBreakpoints from "./components/FBreakpoints.vue";
    import FHeader from "./layouts/FHeader.vue";
    import FFooter from "./layouts/FFooter.vue";
    import gql from 'graphql-tag';
    import FAriaAlert from "./components/core/FAriaAlert/FAriaAlert.vue";

    export default {
        name: 'App',

        components: {
            FAriaAlert,
            FBreakpoint,
            FBreakpoints,
            FHeader,
            FFooter
        },

        apollo: {
            price: {
                query: gql`
                    query Price($to: String!) {
                        price(to: $to) {
                            price
                        }
                    }
                `,

                result(_data) {
                    if (!_data.data.price) {
                        return;
                    }

                    let tokenPrice =  parseFloat(_data.data.price.price);

                    tokenPrice = (parseInt(tokenPrice * 100000) / 100000);

                    this.$store.commit('setTokenPrice', tokenPrice);
                },

                variables() {
                    return {
                        to: 'USD'
                    }
                }
            },

            gasPrice: {
                query: gql`
                    query GasPrice {
                        gasPrice
                    }
                `,

                result(_data) {
                    const gasPrice = parseInt(_data.data.gasPrice);

                    if (gasPrice) {
                        this.$store.commit('setGasPrice', gasPrice);
                    }
                },
            }
        },

        created() {
            this.darkMode(this.$store.state.darkMode);
        },

        methods: {
            /**
             * @param {boolean} _on
             */
            setDarkMode(_on) {
                this.$store.commit('setDarkMode', _on);

                this.darkMode(_on);
            },

            /**
             * @param {boolean} _on
             */
            darkMode(_on) {
                const { documentElement } = document;

                documentElement.classList.add('theme-transition');

                if (_on) {
                    documentElement.classList.add('dark-theme');
                } else {
                    documentElement.classList.remove('dark-theme');
                }

                setTimeout(function () {
                    documentElement.classList.remove('theme-transition');
                }, 250);
            },
        }
    }
</script>

<style lang="scss">
    @import "./assets/scss/main";

    #app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding-top: $f-header-height;

        main {
            flex: 1 1;
            min-height: 700px;
        }
    }

    .narrow-container {
        padding-top: 16px;
        padding-bottom: 16px;
    }
</style>
