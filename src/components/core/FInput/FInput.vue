<template>
    <span :id="id" class="f-input" :class="classes" @click="onClick">
        <slot name="top" v-bind="slotProps">
            <label :for="`${id}-f-inp`">{{ label }}</label>
        </slot>
        <span class="inp" :class="inpClasses">
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
                />
            </template>
            <slot name="suffix"></slot>
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
    mixins: [inputMixin, helpersMixin, eventBusMixin],

    props: {
        // use textarea instead of input element
        isTextarea: {
            type: Boolean,
            default: false,
        },
        // input type
        type: {
            type: String,
            default: 'text',
        },
        // custom validator function
        validator: {
            type: Function,
            default: null,
        },
        // size of input, 'large' | 'small'
        fieldSize: {
            type: String,
            default: '',
        },
        // validate on input event as well
        validateOnInput: {
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
        };
    },

    computed: {
        classes() {
            return {
                'prefix-slot': this.hasSlot('prefix'),
                'suffix-slot': this.hasSlot('suffix'),
                'bottom-slot': this.hasSlot('bottom'),
                'is-textarea': this.isTextarea,
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
            };
        },

        showInfoMessage() {
            return this.hideInfoOnError ? !this.isInvalid : true;
        },
    },

    watch: {
        value(_val) {
            this.val = _val;
        },

        isInvalid() {
            this.setAriaDescribedBy();
        },
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
                // set custom error message
                if (this.isInvalid) {
                    eInput.setCustomValidity(fMessage.getMessage());
                } else {
                    eInput.setCustomValidity('');
                }

                const id = getUniqueId();
                fMessage.$el.id = id;
                this.ariaDescribedBy = id;
            } else {
                this.ariaDescribedBy = null;
            }
        },

        validate(_setError) {
            if (this.validator) {
                this.isInvalid = !this.validator(this.val);

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
            const fMessages = this.findChildrenByName('f-message');
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
            if (_event.target !== this.$refs.input) {
                this.$refs.input.focus();
            }
        },

        /**
         * @param {Event} _event
         */
        onInput(_event) {
            this.val = _event.target.value;
            this.$emit('input', _event.target.value);

            if (this.validateOnInput) {
                this.validate();
            }
        },

        onChange() {
            this.validate();
        },

        onFocus() {
            this.hasFocus = true;
        },

        onBlur() {
            this.hasFocus = false;
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
