import { getCurrentHttpProvider } from '@/plugins/apollo-provider.js';
import { getNestedProp } from '@/utils';
// import { print } from 'graphql';

/** @type {FFetch} */
export let fFetch = null;

/**
 * Minimalistic graphql client.
 */
export class FFetch {
    /**
     * @param {Vue} _Vue
     */
    static install(_Vue) {
        if (!fFetch) {
            fFetch = new FFetch();
            _Vue.prototype.$fFetch = fFetch;
        }
    }

    /**
     * Fetch graphql query.
     *
     * @param {{variables: {}, query: object|string, operationName: string}} _query
     * @return {Promise<*>}
     */
    fetchGQLQuery(_query) {
        if (!_query.operationName && typeof _query.query === 'object') {
            const od = _query.query.definitions.find((_item) => _item.kind === 'OperationDefinition');

            if (od && od.name) {
                _query.operationName = od.name.value;
            }
        }

        return this.fetch({
            operationName: _query.operationName,
            variables: _query.variables,
            query: _query.query.loc ? _query.query.loc.source.body : _query.query,
        });
    }

    /**
     * Fetch all records.
     *
     * @param {{variables: {}, query: object|string, operationName: string}} _query
     * @param {string} _queryName
     * @param {object} _pageInfo
     * @return {Promise<[]>}
     */
    async fetchAllGQLQuery(_query, _queryName, _pageInfo) {
        let edges = [];
        let pageInfo = _pageInfo || { hasNext: true, last: null };
        let data;
        let item;
        const nested = _queryName.indexOf('.') > -1;

        while (pageInfo && pageInfo.hasNext) {
            _query.variables.cursor = pageInfo.last;

            data = await this.fetchGQLQuery(_query);

            if (nested) {
                item = getNestedProp(data.data, _queryName);
            } else {
                item = data.data[_queryName];
            }

            pageInfo = item.pageInfo;
            if (item.edges) {
                edges = edges.concat(item.edges);
            }
        }

        if (nested) {
            item.edges = edges;
            return data;
        } else {
            return edges;
        }
    }

    /**
     * @param {object} _data
     * @param {string} _url
     * @param {string} [_method]
     * @return {Promise<*>}
     * @private
     */
    async fetch(_data, _url = getCurrentHttpProvider(), _method = 'POST') {
        const fetchOptions = {
            method: _method,
            headers: {
                'Content-type': 'application/json',
            },
        };
        let response = null;
        let resp = null;

        fetchOptions.body = JSON.stringify(_data || {});

        response = await fetch(_url, fetchOptions);

        if (fetchOptions.headers['Content-type'] === 'application/json') {
            resp = await response.json();
        } else {
            resp = response.text();
        }

        return resp;
    }
}
