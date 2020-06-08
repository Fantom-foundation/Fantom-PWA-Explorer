<template>
    <button :id="id" type="button" :title="tooltip" class="f-copy-button" @click="onClick">
        <slot>
            <icon
                data="@/assets/svg/copy.svg"
                :width="defaultIconSize.toString()"
                :height="defaultIconSize.toString()"
                aria-hidden="true"
            />
        </slot>

        <f-window
            v-if="popoverCreated"
            ref="popover"
            popover
            :attach-to="`#${id}`"
            attach-position="auto"
            preferred-attach-position="top"
            :attach-margin="[4, 4, 4, 4]"
            :with-header="false"
            :hide-after="hidePopoverAfter"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            style="width: auto; max-width: 360px;"
            @window-hide="onWindowHide"
        >
            <slot name="popover-text">{{ popoverText }}</slot>
        </f-window>
    </button>
</template>

<script>
import copy from 'copy-to-clipboard';
import { getUniqueId } from '../../../utils';
import FWindow from '../FWindow/FWindow.vue';

export default {
    name: 'FCopyButton',

    components: { FWindow },

    props: {
        /** Text to copy. */
        text: {
            type: String,
            default: '',
        },
        /** Popover's text. */
        popoverText: {
            type: String,
            default: 'Copied to clipboard',
        },
        /** Hide popover after this amout of milliseconds. 0 means no auto hiding. */
        hidePopoverAfter: {
            type: Number,
            default: 1600,
        },
        /** Button's tooltip text. */
        tooltip: {
            type: String,
            default: 'Copy to clipboard',
        },
        /** Size of default icon. */
        defaultIconSize: {
            type: Number,
            default: 20,
        },
    },

    data() {
        return {
            id: getUniqueId(),
            popoverCreated: false,
        };
    },

    methods: {
        onClick() {
            copy(this.text);

            if (!this.popoverCreated) {
                this.popoverCreated = true;

                this.$nextTick(() => {
                    this.$refs.popover.show();
                });
            } else {
                this.$refs.popover.show();
            }
        },

        /**
         * Re-target `'window-hide'` event.
         *
         * @param {object} _data
         */
        onWindowHide(_data) {
            this.$emit('window-hide', _data);
        },
    },
};
</script>
