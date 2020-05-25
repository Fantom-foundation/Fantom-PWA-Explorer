<template>
    <button type="button" title="Copy to clipboard" @click="onClick" class="f-copy-button">
        <slot>
            <icon data="@/assets/svg/copy.svg" :width="defaultIconSize.toString()" :height="defaultIconSize.toString()" aria-hidden="true" />
        </slot>
    </button>
</template>

<script>
import copy from 'copy-to-clipboard';

export default {
    name: 'FCopyButton',

    props: {
        /** Text to copy. */
        text: {
            type: String,
            default: '',
        },
        defaultIconSize: {
            type: Number,
            default: 20,
        },
    },

    methods: {
        onClick() {
            copy(this.text);
        },
    },
};
</script>
