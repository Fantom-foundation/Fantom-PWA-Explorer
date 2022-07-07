import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import VueApollo from 'vue-apollo';
import appConfig from '../../../app.config.js';
import { FApolloClient } from './FApolloClient.js';

export const fantomFApolloClient = new FApolloClient({
    apolloProviders: appConfig.apollo.providers,
    defaultProviderIndex: appConfig.apollo.defaultProviderIndex,
});

export const testFApolloClient = new FApolloClient({
    apolloProviders: [{http: 'http://xapi28.fantom.network:16761/api'}],
    defaultProviderIndex: appConfig.apollo.defaultProviderIndex,
});


export const fantomApolloClient = new ApolloClient({
    link: ApolloLink.from([
        fantomFApolloClient.getNetErrorLink(),
        fantomFApolloClient.getRetryLink(),
        fantomFApolloClient.getErrorLink(),
        fantomFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export const testApolloClient = new ApolloClient({
    link: ApolloLink.from([
        testFApolloClient.getNetErrorLink(),
        testFApolloClient.getRetryLink(),
        testFApolloClient.getErrorLink(),
        testFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});


Vue.use(VueApollo);

export const apolloProvider = new VueApollo({
    clients: {
        fantom: fantomApolloClient,
        test: testApolloClient,
    },
    defaultClient: fantomApolloClient,
    defaultOptions: {
        $query: {
            fetchPolicy: 'network-only', // 'cache-and-network', 'network-only', 'cache-first'
        },
    },
});
