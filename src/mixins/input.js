import { inputCommonMixin } from './input-common.js';

// props for custom inputs
export const inputMixin = {
    props: {
        ...inputCommonMixin.props,

        autocomplete: {
            type: String,
            default: null,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        min: {
            type: String,
            default: null,
        },
        max: {
            type: String,
            default: null,
        },
        step: {
            type: String,
            default: null,
        },

        // email, file
        multiple: {
            type: Boolean,
            default: false,
        },

        // password, search, tel, text, url
        placeholder: {
            default: null,
        },
        minlength: {
            default: null,
        },
        maxlength: {
            default: null,
        },

        // textarea
        rows: {
            default: null,
        },
        cols: {
            default: null,
        },

        invalid: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        inputProps() {
            return {
                ...inputCommonMixin.computed.inputCommonProps.call(this),
                autocomplete: this.autocomplete,
                placeholder: this.placeholder,
                readonly: this.readonly,
                min: this.min,
                max: this.max,
                step: this.step,
                multiple: this.multiple,
                minlength: this.minlength,
                maxlength: this.maxlength,
                rows: this.rows,
                cols: this.cols,
            };
        },
    },
};
