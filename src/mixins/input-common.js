import { getUniqueId } from '../utils';

// common props for custom inputs
export const inputCommonMixin = {
    props: {
        id: {
            type: String,
            default() {
                return getUniqueId();
            },
        },
        type: {
            type: String,
            default: '',
        },
        value: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        inputCommonProps() {
            return {
                id: this.id,
                type: this.type,
                // value: this.value,
                name: this.name,
                disabled: this.disabled,
                required: this.required,
            };
        },
    },
};
