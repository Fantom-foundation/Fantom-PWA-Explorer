const path = require('path');
const svgFilePath = path.join(__dirname, './src/assets/svg');

module.exports = {
    publicPath: '',

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    },

    chainWebpack: config => {

        config.module
            .rule('vue-svgicon')
            .test(/\.svg$/)
            .use('svgicon')
            .loader('@yzfe/vue-svgicon-loader')
            .options({
                idSeparator: '_',
                svgFilePath
            });


        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.transformAssetUrls = options.transformAssetUrls || {};
                options.transformAssetUrls['icon'] = ['data'];
                return options
            });

        config.module.rule('svg').exclude.add(svgFilePath);

        config.resolve.alias.set('@icon', svgFilePath);

        config.resolve.symlinks(false);
    }
};
