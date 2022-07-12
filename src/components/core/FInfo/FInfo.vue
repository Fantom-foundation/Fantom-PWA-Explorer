<template>
    <span :id="id" class="f-info">
        <span @click="onButtonClick">
            <slot name="button">
                <button class="no-style" :title="buttonTooltip">
                    <slot name="button-content">
                        <icon data="@/assets/svg/info.svg" :width="iconSize" :height="iconSize" />
                    </slot>
                </button>
            </slot>
        </span>

        <f-window
            v-if="windowCreated"
            ref="window"
            :popover="!usePopup"
            hide-on-window-mousedown
            :attach-to="`#${id}`"
            attach-position="auto"
            preferred-attach-position="top"
            :title="windowTitle"
            :no-title="!windowTitle"
            :with-header="windowCloseable || !!windowTitle"
            :attach-margin="[4, 4, 4, 4]"
            :hide-after="hideWindowAfter"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            :style="windowStyle"
            :class="windowClass"
            @window-hide="$emit('window-hide', $event)"
        >
            <slot name="window-text"><slot></slot></slot>
        </f-window>
    </span>
</template>

<script>
import FWindow from '../FWindow/FWindow.vue';
import { getUniqueId } from '../../../utils';

export default {
    name: 'FInfo',

    components: { FWindow },

    props: {
        /** Use popup window instead of popover. */
        usePopup: {
            type: Boolean,
            default: false,
        },
        /** Hide window after this amout of milliseconds. 0 means no auto hiding. */
        hideWindowAfter: {
            type: Number,
            default: 0,
        },
        /** Window with header and close button. */
        windowCloseable: {
            type: Boolean,
            default: false,
        },
        /** Window's title. */
        windowTitle: {
            type: String,
            default: '',
        },
        /** Window's style. */
        windowStyle: {
            type: String,
            default: 'width: auto; max-width: 360px;',
        },
        /** Window's css class. */
        windowClass: {
            type: String,
            default: '',
        },
        /** Button's tooltip text. */
        buttonTooltip: {
            type: String,
            default: 'Show info',
        },
        /** Default icon size. */
        iconSize: {
            type: String,
            default: '20',
        },
    },

    data() {
        return {
            id: getUniqueId(),
            windowCreated: false,
        };
    },

    methods: {
        onButtonClick() {
            if (!this.windowCreated) {
                this.windowCreated = true;

                this.$nextTick(() => {
                    this.$refs.window.show();
                });
            } else {
                this.$refs.window.show();
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
