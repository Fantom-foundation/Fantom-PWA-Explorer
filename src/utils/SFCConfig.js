import gql from "graphql-tag";
import {toInt} from "@/utils/index.js";

export class SFCConfig {
    static _apolloClient = null;
    static _config = null;

    static async get() {
        let config = SFCConfig._config;

        if (!config) {
            config = await SFCConfig._getSFCConfig();
            SFCConfig._config = config;
        }

        return config;
    }

    static setApolloClient(apolloClient) {
        SFCConfig._apolloClient = apolloClient;
    }

    static async _getSFCConfig() {
        const data = await SFCConfig._apolloClient.query({
            query: gql`
                query SFCConfig {
                    sfcConfig {
                        minLockupDuration
                        maxLockupDuration
                    }
                }
            `,
            fetchPolicy: 'network-only',
        });

        return SFCConfig._adjustSFCConfig(data.data && data.data.sfcConfig || {});
    }

    static _adjustSFCConfig(config) {
        const DAY = 60 * 60 * 24;

        if (config.minLockupDuration) {
            config.minLockupDuration = toInt(config.minLockupDuration);
            config.minLockupDurationDays = config.minLockupDuration / DAY;
        }

        if (config.maxLockupDuration) {
            config.maxLockupDuration = toInt(config.maxLockupDuration);
            config.maxLockupDurationDays = config.maxLockupDuration / DAY;
        }

        return config;
    }

    static _getApolloClient() {
        const apolloClient = SFCConfig._apolloClient;

        if (apolloClient) {
            return apolloClient;
        } else {
            throw new Error('No apollo client is set');
        }
    }
}
