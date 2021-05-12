<template>
    <label v-if="native" :for="id" :class="classes">
        <slot>{{ label }}</slot>
    </label>
    <span v-else :id="id" :class="classes">
        <slot>{{ label }}</slot>
    </span>
</template>

<script>
/**
 * Renders `label` or `span` element.
 */
export default {
    name: 'FLabel',

    props: {
        /** Id for `for` attribute of `label` element or id of `span` element */
        id: {
            type: String,
            default: '',
            required: true,
        },
        /** Text */
        label: {
            type: String,
            default: '',
        },
        /**
         * If `true`, component renders `label` element with `for` attribute,
         * otherwise `span` element with `id`
         */
        native: {
            type: Boolean,
            default: false,
        },
        /** If `true`, component will be visible just for screen readers */
        notVisible: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        classes() {
            return {
                flabel: true,
                'flabel-notvisible': this.notVisible,
            };
        },
    },
};
</script>

<style lang="scss">
@import "style";
</style>
