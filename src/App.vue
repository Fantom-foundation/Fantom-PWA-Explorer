<template>
    <div id="app">
        <f-header></f-header>
        <main>
            <!--        <img alt="Vue logo" src="./assets/logo.png">-->
            <router-view></router-view>
        </main>
        <f-footer></f-footer>

        <f-breakpoints>
            <f-breakpoint value="768px" code="menu-mobile"></f-breakpoint>
            <f-breakpoint value="600px" code="data-table-mobile-view"></f-breakpoint>
            <f-breakpoint value="1000px" code="transaction-list-dt-mobile-view"></f-breakpoint>
        </f-breakpoints>
    </div>
</template>

<script>
    import FBreakpoint from "./components/FBreakpoint.vue";
    import FBreakpoints from "./components/FBreakpoints.vue";
    import FHeader from "./layouts/FHeader.vue";
    import FFooter from "./layouts/FFooter.vue";

    export default {
        name: 'App',
        components: {
            FBreakpoint,
            FBreakpoints,
            FHeader,
            FFooter
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
        }
    }

    .narrow-container {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    // TMP
    .f-chip {
        display: inline-block;
        padding: 4px 8px;
        color: #fff;
        background-color: $theme-color;
        border-radius: 4px;
        margin-right: 2px;
        margin-bottom: 2px;
        font-size: 0.85em;
    }
</style>
