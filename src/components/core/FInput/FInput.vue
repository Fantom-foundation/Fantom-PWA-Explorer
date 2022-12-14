<template>
    <span :id="id" class="f-input" :class="classes" @click="onClick">
        <slot name="top" v-bind="slotProps">
            <label :for="inputId">{{ label }}</label>
        </slot>
        <template v-if="disabledAsText && disabled">
            {{ val }}
        </template>
        <span v-else class="f-inp" :class="inpClasses">
            <slot name="prefix"></slot>
            <template v-if="isTextarea">
                <textarea
                    :id="`${id}-f-inp`"
                    ref="input"
                    v-bind="inputProps"
                    :value="val"
                    :aria-invalid="isInvalid"
                    :aria-describedby="ariaDescribedBy"
                    @input="onInput"
                    @change="onChange"
                    @focus="onFocus"
                    @blur="onBlur"
                ></textarea>
            </template>
            <template v-else>
                <input
                    :id="inputId"
                    ref="input"
                    v-bind="inputProps"
                    :value="val"
                    :aria-invalid="isInvalid"
                    :aria-describedby="ariaDescribedBy"
                    @input="onInput"
                    @change="onChange"
                    @focus="onFocus"
                    @blur="onBlur"
                />
            </template>
            <slot name="suffix"></slot>
            <span v-if="showCharsCounter" class="f-input_charscounter">{{ numChars }}/{{ maxlength }}</span>
        </span>
        <slot name="bottom" v-bind="slotProps"></slot>
    </span>
</template>

<script>
import { inputMixin } from '../../../mixins/input.js';
import { helpersMixin } from '../../../mixins/helpers.js';
import { getUniqueId } from '../../../utils';
import { eventBusMixin } from '../../../mixins/event-bus.js';

export default {
    name: 'FInput',

    mixins: [inputMixin, helpersMixin, eventBusMixin],

    props: {
        /** Use textarea instead of input element */
        isTextarea: {
            type: Boolean,
            default: false,
        },
        /** Input type */
        type: {
            type: String,
            default: 'text',
        },
        /** Custom validator function */
        validator: {
            type: Function,
            default: null,
        },
        /** Size of input, 'large' | 'small' */
        fieldSize: {
            type: String,
            default: '',
        },
        /** Validate on input event as well */
        validateOnInput: {
            type: Boolean,
            default: false,
        },
        /** Show disabled input/textarea as plain text, not disabled input/textarea */
        disabledAsText: {
            type: Boolean,
            default: false,
        },
        /** Don't style f-input as input field */
        noInputStyle: {
            type: Boolean,
            default: false,
        },
        showCharsCounter: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            val: this.value,
            isInvalid: this.invalid,
            hasFocus: false,
            errmsgslot: 'suffix',
            ariaDescribedBy: null,
            inputId: `${this.id}-f-inp`,
            numChars: 0,
        };
    },

    computed: {
        classes() {
            return {
                'prefix-slot': this.hasSlot('prefix'),
                'suffix-slot': this.hasSlot('suffix'),
                'bottom-slot': this.hasSlot('bottom'),
                'is-textarea': this.isTextarea,
                'no-input-style': this.noInputStyle,
            };
        },

        inpClasses() {
            return {
                focus: this.hasFocus,
                invalid: this.isInvalid,
                large: this.fieldSize === 'large',
                small: this.fieldSize === 'small',
                readonly: this.readonly,
                disabled: this.disabled,
                inp: !this.noInputStyle,
            };
        },

        fInputProps() {
            return {
                ...this.inputProps,
                label: this.label,
                isTextarea: this.isTextarea,
                validator: this.validator,
                fieldSize: this.fieldSize,
                validateOnInput: this.validateOnInput,
                hideInfoOnError: this.hideInfoOnError,
            };
        },

        slotProps() {
            return {
                showErrorMessage: this.isInvalid,
                showInfoMessage: this.showInfoMessage,
                inputId: this.inputId,
                label: this.label,
            };
        },

        showInfoMessage() {
            return this.hideInfoOnError ? !this.isInvalid : true;
        },
    },

    watch: {
        value(_val) {
            const oldVal = this.val;

            this.val = _val;

            if (this.validateOnInput && oldVal !== _val) {
                this.validate();
            }
        },

        isInvalid() {
            this.setAriaDescribedBy();
        },
    },

    created() {
        if (this.showCharsCounter && !this.maxlength) {
            throw new Error(`'maxlength' has to be set if 'showCharsCounter' is set`);
        }
    },

    mounted() {
        this.setAriaDescribedBy();
    },

    methods: {
        /**
         * Set aria-describedby attribute according to `isInvalid` property if FMessage child component exists.
         */
        setAriaDescribedBy() {
            const eInput = this.$refs.input;
            let fMessage;

            if (this.isInvalid) {
                fMessage = this.getFMessage('error');
            } else {
                fMessage = this.getFMessage('info');
                // eInput.setCustomValidity('');
                // this.ariaDescribedBy = null;
            }

            if (fMessage) {
                if (eInput) {
                    // set custom error message
                    if (this.isInvalid) {
                        eInput.setCustomValidity(fMessage.getMessage());
                    } else {
                        eInput.setCustomValidity('');
                    }
                }

                const id = getUniqueId();
                fMessage.$el.id = id;
                this.ariaDescribedBy = id;
            } else {
                this.ariaDescribedBy = null;
            }
        },

        async validate(_setError) {
            if (this.validator) {
                const result = this.validator(this.val);

                if (result instanceof Promise) {
                    const value = await result;
                    this.isInvalid = !value;
                } else {
                    this.isInvalid = !result;
                }

                if (_setError) {
                    this.setAriaDescribedBy();
                }
            }
        },

        /**
         * Get FMessage child component by type.
         *
         * @param {string} _type
         * @return {null|*|Vue}
         */
        getFMessage(_type) {
            const fMessages = this.findChildrenByName('f-message', true);
            let fMessage = null;

            for (let i = 0, len1 = fMessages.length; i < len1; i++) {
                fMessage = fMessages[i];
                if (fMessage && fMessage.$props.type === _type) {
                    break;
                }
            }

            return fMessage;
        },

        /**
         * @param {Event} _event
         */
        onClick(_event) {
            const eInput = this.$refs.input;

            if (eInput && _event.target !== eInput) {
                eInput.focus();
            }
        },

        /**
         * @param {Event} _event
         */
        onInput(_event) {
            this.val = _event.target.value;

            /**
             * Passthrough input event
             * @type {Event}
             */
            this.$emit('input', _event.target.value);

            if (this.validateOnInput) {
                this.validate();
            }

            if (this.showCharsCounter) {
                this.numChars = this.val.length;
            }
        },

        onChange() {
            this.validate();
        },

        onFocus() {
            this.hasFocus = true;
            this.$emit('focus');
        },

        onBlur() {
            this.hasFocus = false;
            this.$emit('blur');
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
