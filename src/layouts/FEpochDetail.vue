<template>
    <div class="fepochdetail f-data-layout">
        <f-card>
            <template v-if="!queryError">
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('epoch.epoch') }}</div>
                    <div class="col"><div class="break-word">{{ id }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('epoch.end_time') }}</div>
                    <div class="col">
                        <div class="break-word">{{ formatDate(timestampToDate(cEpoch.endTime)) }}</div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('epoch.total_base_reward') }}</div>
                    <div class="col">
                        <div class="break-word">
                            {{ formatNumberByLocale(WEIToFTM(cEpoch.totalBaseRewardWeight), 1, 2) }} FTM
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('epoch.total_fee') }}</div>
                    <div class="col">
                        <div class="break-word">
                            {{ formatNumberByLocale(WEIToFTM(cEpoch.epochFee), 1, 2) }} FTM
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('epoch.total_tx_reward') }}</div>
                    <div class="col">
                        <div class="break-word">
                            {{ formatNumberByLocale(WEIToFTM(cEpoch.totalTxRewardWeight), 1, 2) }} FTM
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="query-error">{{ queryError }}</div>
            </template>
        </f-card>
    </div>
</template>

<script>
import FCard from "../components/core/FCard/FCard.vue";
import gql from 'graphql-tag';
import { WEIToFTM } from "../utils/transactions.js";
import {timestampToDate, formatDate, formatNumberByLocale} from "../filters.js";

export default {
    components: {
        FCard
    },

    props: {
        /** Block number. */
        id: {
            type: Number,
            required: true,
            default: 0
        }
    },

    apollo: {
        epoch: {
            query: gql`
                query EpochById($id: Long) {
                    epoch (id: $id) {
                        id
                        endTime
                        epochFee
                        totalTxRewardWeight
                        totalBaseRewardWeight
                    }
                }
            `,
            variables() {
                return {
                    number: `0x${parseInt(this.id).toString(16)}`
                }
            },
            error(_error) {
                this.queryError = _error.message;
            }
        }
    },

    data() {
        return {
            queryError: '',
            dRecordsCount: 0,
            dTransactions: []
        }
    },

    computed: {
        cEpoch() {
            return this.epoch || {};
        },
    },

    methods: {
        WEIToFTM,
        timestampToDate,
        formatDate,
        formatNumberByLocale
    }
}
</script>
