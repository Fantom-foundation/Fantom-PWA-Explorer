import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// New Imports
import { ApolloLink, concat, split } from 'apollo-link'
import { RetryLink } from "apollo-link-retry";
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import VueApollo from 'vue-apollo'

import appConfig from "../../app.config.js";
import {shuffle} from "../utils/array.js";

/**
 * Create an array of shuffled http providers excluding default provider.
 *
 * @param {Array} _providers
 * @param {String} _defaultHttpProvider
 * @return {Array}
 */
function setHttpApolloProviders(_providers, _defaultHttpProvider) {
    const providers = _providers.map(_item => _item.http).filter(_value => _value !== _defaultHttpProvider);

    shuffle(providers);

    return providers;
}

const apolloProviders = appConfig.apollo.providers;
const maxRetryLinkAttempts = apolloProviders.length;
let defaultProviderIndex = appConfig.apollo.defaultProviderIndex;

if (defaultProviderIndex === 'random') {
    defaultProviderIndex = Math.floor(Math.random() * apolloProviders.length);
}

const defaultHttpProvider = apolloProviders[defaultProviderIndex].http;
let httpProvider = defaultHttpProvider;
let httpApolloProviders = setHttpApolloProviders(apolloProviders, defaultHttpProvider);
let lastOperationName = '';

function resetHttpApolloProviders() {
    httpApolloProviders = setHttpApolloProviders(apolloProviders, defaultHttpProvider);
    lastOperationName = '';
}

const httpLink = new HttpLink({
    uri: httpProvider
});

const wsLink = new WebSocketLink({
    uri: 'wss://xapi8.fantom.network/graphql',
    options: {
        reconnect: true,
    },
})

const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
    },
    wsLink,
    httpLink
)

export function getCurrentHttpProvider() {
    return httpProvider;
}

const httpProviderMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
        uri: httpProvider
    });

    return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
        resetHttpApolloProviders();
    }
});

const retryLink = new RetryLink({
    delay: {
        initial: 350,
        max: Infinity,
        jitter: false
    },
    attempts: {
        max: maxRetryLinkAttempts,
        retryIf: (_error, _operation) => {
            // change http provider
            if ((httpApolloProviders.length > 0)
                && (!lastOperationName || _operation.operationName === lastOperationName)) {
                httpProvider = httpApolloProviders.pop();
                lastOperationName = _operation.operationName;
            }

            return !!_error;
        }
    }
});

export const apolloClient = new ApolloClient({
    link: ApolloLink.from([
        errorLink,
        retryLink,
        concat(httpProviderMiddleware, link)
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true
});

Vue.use(VueApollo);

export const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
        $query: {
            fetchPolicy: 'network-only'  // 'cache-and-network', 'network-only', 'cache-first'
        }
    }
});
