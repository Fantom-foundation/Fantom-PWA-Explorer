<template>
    <div class="networknodesmap">
        <h3 class="number">{{ totalCount === 0 ? '-' : totalCount }}</h3>
        <WorldMap :markers="cNetworkNodes" enable-zooming reverse-zooming enable-panning>
            <template #marker="{ marker:node }">
                <div class="networknodesmap_node" :style="getNodeStyle(node)">
                    <span class="networknodesmap_node_label">{{ node.region }}</span>
                    <span class="networknodesmap_node_count">{{ formatNumber(node.count) }}</span>
                    <span class="networknodesmap_node_pct">({{ node.pct }}%)</span>
                </div>
            </template>
        </WorldMap>
    </div>
</template>

<script>
import WorldMap from "@/components/WorldMap/WorldMap.vue";
import gql from "graphql-tag";
import {COUNTRIES_BY_NAME} from "@/components/WorldMap/countries_by_name.js";
import {formatNumberByLocale} from "@/filters.js";
import {tmpResponse} from "@/components/WorldMap/tmp-response.js";

export default {
    name: "NetworkNodesMap",

    components: {WorldMap},

    data() {
        return {
            networkNodes: [],
            totalCount: 0,
        }
    },

    computed: {
        cNetworkNodes() {
            const { networkNodes } = this;

            networkNodes.forEach(node => {
                node._size = this.getNodeSize(node);
            })

            return networkNodes;
        }
    },

    created() {
        this.loadNetworkNodes();
    },

    methods: {
        async loadNetworkNodes() {
            const countries = COUNTRIES_BY_NAME();
            const nodes = await this.fetchNetworkNodes();
            // const nodes = await this.getTMPNetworkNodes();
            const networkNodes = [];

            nodes.forEach(node => {
                const country = countries[node.region];

                if (country) {
                    networkNodes.push({
                        count: node.count,
                        pct: formatNumberByLocale(node.pct / 10, 1),
                        region: node.region,
                        topRegion: node.topRegion,
                        // lat: node.latitude,
                        // lon: node.longitude,
                        lat: country.lat,
                        lon: country.lon,
                    });
                } else {
                    console.warn('Region not found', node);
                }
            });

            this.networkNodes = networkNodes;
        },

        async fetchNetworkNodes(level = 'COUNTRY') {
            const data = await this.$apollo.query({
                query: gql`
                    query GetNetworkNodes($level: NetworkNodeGroupLevel = COUNTRY) {
                        networkNodesAggregated (level: $level) {
                            level
                            totalCount
                            groups {
                                topRegion
                                region
                                count
                                pct
                                latitude
                                longitude
                            }
                        }
                    }
                `,
                variables: {
                    level,
                },
                fetchPolicy: 'network-only',
                // client: 'test'
            });

            this.totalCount = this.formatNumber(data.data.networkNodesAggregated.totalCount);

            return data.data.networkNodesAggregated.groups || [];
        },

        async getTMPNetworkNodes() {
            const data = tmpResponse;

            this.totalCount = this.formatNumber(data.data.networkNodesAggregated.totalCount);

            return data.data.networkNodesAggregated.groups || [];
        },

        getNodeSize(node) {
            const maxSize = 44;
            const minSize = 10;
            const maxCount = 360;
            let size = (node.count / maxCount) * maxSize;

            if (size < minSize) {
                size = minSize;
            } else if (size > maxSize) {
                size = maxSize;
            }

            size = Math.floor(size);

            return size;
        },

        getNodeStyle(node) {
            return {
                width: `${node._size}px`,
                height: `${node._size}px`,
            }
        },

        formatNumber(number) {
            return formatNumberByLocale(number, 0);
        }
    }
}
</script>

<style lang="scss">
.networknodesmap {
    --networknodesmap-node-color: rgba(99, 171, 243, 0.8);


    &_node {
        border-radius: 50%;
        width: 16px;
        height: 16px;
        background: var(--networknodesmap-node-color);
        //background: #00ff04;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        overflow: hidden;

        transition: all 250ms ease;

        > span {
            opacity: 0;
            transition: all 250ms ease;
        }

        &_label {
            font-size: 0.53em;
        }

        &_pct {
            font-size: 0.53em;
        }

        &:hover {
            width: 70px !important;
            height: 50px !important;
            transform: scale(2);
            border-radius: 4px;

            > span {
                opacity: 1;
            }
        }
    }

    h3 {
        font-weight: normal;
        text-align: center;
        font-size: 64px;
    }
}
</style>
