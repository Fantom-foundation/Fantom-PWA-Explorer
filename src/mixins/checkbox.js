import { inputCommonMixin } from './input-common.js';

// props for custom inputs
export const checkboxMixin = {
    props: {
        ...inputCommonMixin.props,

        checked: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        checkboxProps() {
            return {
                ...inputCommonMixin.computed.inputCommonProps.call(this),
                checked: this.checked,
            };
        },
    },
};
