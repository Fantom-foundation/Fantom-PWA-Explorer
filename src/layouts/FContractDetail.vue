<template>
    <div class="f-contract-detail">
        <f-card class="f-data-layout">
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t("view_contract_detail.creator") }}</div>
                <div class="col-8">
                    <router-link
                        v-if="contract.deployedBy"
                        :to="{name: 'transaction-detail', params: {id: contract.deployedBy.hash}}"
                        :title="contract.deployedBy.hash"
                    >
                        <f-ellipsis :text="contract.deployedBy.hash" overflow="middle" />
                    </router-link>
                </div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t("view_contract_detail.name") }}</div>
                <div class="col-8">{{ contract.name }}</div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t("view_contract_detail.version") }}</div>
                <div class="col-8">{{ contract.version }}</div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t("view_contract_detail.compiler") }}</div>
                <div class="col-8">{{ contract.compiler }}</div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t("view_contract_detail.deployed") }}</div>
                <div class="col-8">{{ formatDate(timestampToDate(contract.timestamp)) }}</div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t("view_contract_detail.validated") }}</div>
                <div class="col-8">{{ formatDate(timestampToDate(contract.validated)) }}</div>
            </div>
            <div class="row no-collapse">
                <div class="col-4 f-row-label">{{ $t("view_contract_detail.support_contact") }}</div>
                <div class="col-8">{{ contract.supportContact }}</div>
            </div>
<!--            <div v-if="!contract.validated" class="row no-collapse">
                <div class="col-12 align-center">
                    <button @click="onValidateContract" class="btn large">
                        {{ $t('view_contract_detail.validate_contract') }}
                    </button>
                </div>
            </div>-->
        </f-card>

        <f-tabs aria-label="Contract Tabs">
            <template #transactions>
                <h2>
                    {{ $t("view_contract_detail.transactions") }}
                    <span class="f-records-count">({{ dRecordsCount }})</span>
                </h2>
            </template>
            <template #abi>
                <h2>{{ $t("view_contract_detail.abi") }}</h2>
            </template>
            <template #source-code>
                <h2>{{ $t("view_contract_detail.source_code") }}</h2>
            </template>

            <f-tab title-slot="transactions">
                <f-transaction-list
                    :items="cTransactionItems"
                    :loading="cLoading"
                    :address-col="id"
                    @fetch-more="onFetchMore"
                ></f-transaction-list>
            </f-tab>
            <f-tab title-slot="abi" :disabled="!contract.abi">
                <f-card>
                    <div class="source-code">
                        <div>
                            <pre class="break">{{ formatJSON(contract.abi) }}</pre>
                        </div>
                        <f-copy-button
                            :text="contract.abi"
                            :tooltip="$t('copy_to_clipboard', {what: $t('view_contract_detail.abi')})"
                            :popoverText="$t('copied_to_clipboard', {what: $t('view_contract_detail.abi')})"
                            class="btn light large same-size round"
                        />
                    </div>
                </f-card>
            </f-tab>
            <f-tab title-slot="source-code" :disabled="!contract.sourceCode">
                <f-card>
                    <div class="source-code">
                        <div>
                            <pre>{{ contract.sourceCode }}</pre>
                        </div>
                        <f-copy-button
                            :text="contract.sourceCode"
                            :tooltip="$t('copy_to_clipboard', {what: $t('source_code')})"
                            :popoverText="$t('copied_to_clipboard', {what: $t('source_code')})"
                            class="btn light large same-size round"
                        />
                    </div>
                </f-card>
            </f-tab>
        </f-tabs>

        <f-window
            ref="validateContractWindow"
            modal
            style="max-width: 680px;"
            :title="$t('view_contract_detail.validate_contract')"
            class="double-body-padding"
            :z-index="14"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
        >
            <validate-contract-form :contract-data="contract" @contract-validated="onContractValidated" />
        </f-window>
    </div>
</template>

<script>
    import FCard from "../components/core/FCard/FCard.vue";
    import FTabs from "../components/core/FTabs/FTabs.vue";
    import FTab from "../components/core/FTabs/FTab.vue";
    import FTransactionList from "../data-tables/FTransactionList.vue";
    import FEllipsis from "../components/core/FEllipsis/FEllipsis.vue";
    import FAddressDetail from "./FAddressDetail.vue";
    import FCopyButton from "../components/core/FCopyButton/FCopyButton.vue";
    import FWindow from "../components/core/FWindow/FWindow.vue";
    import ValidateContractForm from "../forms/ValidateContractForm.vue";
    import {formatDate} from "../filters.js";

    export default {
        name: "FContractDetail",

        components: {ValidateContractForm, FWindow, FCopyButton, FEllipsis, FTransactionList, FTab, FTabs, FCard},

        mixins: [FAddressDetail],

        computed: {
            contract() {
                return this.account ? this.account.contract : {};
            },
        },

        methods: {
            formatJSON(_jsonStr) {
                try {
                    const json = JSON.parse(_jsonStr);

                    return JSON.stringify(json, undefined, 4);
                } catch (_e) {
                    return _jsonStr;
                }
            },

            onValidateContract() {
                this.$refs.validateContractWindow.show();
            },

            onContractValidated(_contract) {
                // update contract
                this.account.contract = _contract;

                this.$refs.validateContractWindow.hide('fade-leave-active');
            },

            formatDate: formatDate,
        }
    }
</script>

<style lang="scss">
    .f-contract-detail {
        .source-code {
            position: relative;
            width: 100%;

            > div {
                width: 100%;
                overflow-x: auto;
            }

            pre {
                width: 100%;
                min-width: 800px;
                padding: 16px;
                background-color: #f6f6f6;
                white-space: pre-wrap;

                &.break {
                    word-wrap: break-word;
                    /*white-space: pre-line;*/
                }
            }

            .f-copy-button {
                position: absolute;
                top: 8px;
                right: 8px;
            }
        }
    }
</style>
