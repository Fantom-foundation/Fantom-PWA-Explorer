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
            <f-breakpoint value="1000px" code="transaction-list-dt-mobile-view"></f-breakpoint>
            <f-breakpoint value="1100px" code="validator-list-dt-mobile-view"></f-breakpoint>
        </f-breakpoints>
    </div>
</template>

<script>
    import FBreakpoint from "./components/FBreakpoint.vue";
    import FBreakpoints from "./components/FBreakpoints.vue";
    import FHeader from "./layouts/FHeader.vue";
    import FFooter from "./layouts/FFooter.vue";
    import gql from 'graphql-tag';

    export default {
        name: 'App',

        components: {
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
                    let tokenPrice =  parseFloat(_data.data.price.price);

                    tokenPrice = (parseInt(tokenPrice * 100000) / 100000);

                    this.$store.commit('setTokenPrice', tokenPrice);
                },

                variables() {
                    return {
                        to: 'USD'
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "./assets/scss/main";

    #app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding-top: var(--f-header-height);

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
