const appConfig = {
    // app title
    name: "Fantom Explorer",
    // app description
    description:
        "Fantom Explorer allows you to explore and search the Fantom blockchain for transactions, addresses and blocks",
    // app keywords
    keywords: "fantom, explorer, search, blockchain, crypto, currency",
    // apollo client settings
    apollo: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            /*{
                http: 'https://xapi3.fantom.network/api',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi4.fantom.network/api',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi5.fantom.network/api',
                // for subscriptions
                ws: '',
            },*/
            {
                http: 'https://xapi6.fantom.network/api',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi7.fantom.network/api',
                // for subscriptions
                ws: '',
            },
            /*{
                http: 'https://xapi8.fantom.network/api',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi9.fantom.network/api',
                // for subscriptions
                ws: '',
            },*/
        ],
        // index into providers array of default provider or 'random' - takes index randomly
        defaultProviderIndex: "random"
    },
    //
    useTestnet: false,
    // use 'hash' mode in vue router
    routerHashMode: false,
    // testnet config
    testnet: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            {
                http: 'https://xapi.testnet.fantom.network/api',
                // for subscriptions
                ws: '',
            },
        ],
    },
    // progressive web application
    usePWA: true,
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: "Fantom Explorer"
    },
    // default options for production build
    build: {
        // output dir for production build
        outputDir: "dist"
    },
    // downtime threshold in seconds. downtime values less than this threshold will be displayed as 0
    downtimeThreshold: 10
};

if (appConfig.useTestnet) {
    appConfig.apollo.providers = appConfig.testnet.providers;
}

// scss variables prepended to every scss file
appConfig.scssData = `
    @import "src/assets/scss/vars";
`;

module.exports = appConfig;
