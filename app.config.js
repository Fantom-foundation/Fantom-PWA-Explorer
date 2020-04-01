const appConfig = {
    // app title
    name: 'Fantom Explorer',
    // progressive web application
    usePWA: true,
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: 'Fantom Explorer'
    },
    // default options for production build
    build: {
        // output dir for production build
        outputDir: 'dist'
    }
};

// scss variables prepended to every scss file
appConfig.scssData = `
    @import "src/assets/scss/vars";
`;

module.exports = appConfig;
