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
            :hide-after="1600"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            style="width: auto; max-width: 360px;"
        >
            {{ popoverText }}
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
    },
};
</script>
