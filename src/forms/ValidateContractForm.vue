<template>
    <div class="validate-contract-form">
        <f-form center-form @f-form-submit="onFormSubmit">
            <fieldset>
                <legend class="not-visible">{{ $t('validate_contract_form.validate_contract') }}</legend>

                <div class="form-body">
                    <f-input
                        :value="contractData.name"
                        type="text"
                        :label="`${$t('validate_contract_form.name')} (${$t('optional')})`"
                        field-size="large"
                        name="name"
                        maxlength="64"
                        validate-on-input
                        :validator="checkName"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                {{ $t('maximum_allowed_characters_length', { len: 64 }) }}
                            </f-message>
                        </template>
                    </f-input>

                    <f-input
                        :value="contractData.version"
                        type="text"
                        :label="`${$t('validate_contract_form.version')} (${$t('optional')})`"
                        field-size="large"
                        name="version"
                        maxlength="14"
                        validate-on-input
                        :validator="checkVersion"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                {{ $t('maximum_allowed_characters_length', { len: 14 }) }}
                            </f-message>
                        </template>
                    </f-input>

                    <f-input
                        :value="contractData.supportContact"
                        type="text"
                        :label="`${$t('validate_contract_form.support_contact')} (${$t('optional')})`"
                        field-size="large"
                        name="supportContact"
                        maxlength="64"
                        validate-on-input
                        :validator="checkSupportContact"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                {{ $t('maximum_allowed_characters_length', { len: 64 }) }}
                            </f-message>
                        </template>
                    </f-input>

                    <f-input
                        :value="contractData.sourceCode"
                        type="text"
                        is-textarea
                        rows="20"
                        :label="`${$t('validate_contract_form.source_code')}`"
                        field-size="large"
                        name="sourceCode"
                        validate-on-input
                        :validator="checkSourceCode"
                    >
                        <template #bottom="sProps">
                            <f-message v-show="sProps.showErrorMessage" type="error" role="alert" with-icon>
                                {{ $t('required_field') }}
                            </f-message>
                        </template>
                    </f-input>

                    <div class="align-center form-buttons">
                        <f-message v-if="errorMessage" type="error" with-icon>{{ errorMessage }}</f-message>
                        <button type="submit" class="btn large">{{ $t('validate_contract_form.validate') }}</button>
                    </div>
                </div>
            </fieldset>
        </f-form>
    </div>
</template>

<script>
    import FForm from "../components/core/FForm/FForm.vue";
    import FInput from "../components/core/FInput/FInput.vue";
    import FMessage from "../components/core/FMessage/FMessage.vue";
    import gql from "graphql-tag";

    export default {
        name: "ValidateContractForm",

        components: {FMessage, FInput, FForm},

        props: {
            /** Account data */
            contractData: {
                type: Object,
                default() {
                    return {
                        sourceCode: '',
                        name: '',
                        version: '',
                        supportContact: '',
                        address: '',
                    };
                },
                required: true,
            },
        },

        data() {
            return {
                errorMessage: '',
            };
        },

        methods: {
            validateContract(_contract) {
                this.$apollo
                    .mutate({
                        mutation: gql`
                        mutation($contract: ContractValidationInput!) {
                            validateContract(contract: $contract) {
                                address
                                deployedBy {
                                    hash
                                    contractAddress
                                }
                                name
                                version
                                compiler
                                sourceCode
                                abi
                                validated
                                supportContact
                                timestamp
                            }
                        }
                    `,
                        variables: {
                            contract: _contract,
                        },
                    })
                    .then((_data) => {
                        this.$emit('contract-validated', _data.data.validateContract);
                    })
                    .catch((_error) => {
                        this.errorMessage = _error;
                    });
            },

            /**
             * @param {string} _value
             * @return {boolean}
             */
            checkName(_value) {
                return _value.length <= 64;
            },

            /**
             * @param {string} _value
             * @return {boolean}
             */
            checkVersion(_value) {
                return _value.length <= 14;
            },

            /**
             * @param {string} _value
             * @return {boolean}
             */
            checkSupportContact(_value) {
                return _value.length <= 64;
            },

            /**
             * @param {string} _value
             * @return {boolean}
             */
            checkSourceCode(_value) {
                return !!_value.trim();
            },

            onFormSubmit(_event) {
                const { data } = _event.detail;

                if (!data.name) {
                    delete data.name;
                }

                if (!data.version) {
                    delete data.version;
                }

                if (!data.supportContact) {
                    delete data.supportContact;
                }

                this.validateContract({ address: this.contractData.address, ...data})
            }
        }
    }
</script>

<style lang="scss">
.form-buttons {
    .f-message {
        margin-bottom: 16px;
    }
}
</style>
