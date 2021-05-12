import { inputCommonMixin } from './input-common.js';

const selectM = {
    props: { ...inputCommonMixin.props },

    computed: {
        ...inputCommonMixin.computed,

        selectProps() {
            return {
                ...this.inputCommonProps,
                type: null,
            };
        },
    },
};

delete selectM.props.type;

export const selectMixin = selectM;
