<template>
    <transition name="fade">
        <div v-if="isVisible" class="f-overlay" :style="style" @click="onClick">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'FOverlay',

    props: {
        hideOnClick: {
            type: Boolean,
            default: true,
        },
        zIndex: {
            type: Number,
            default: 1,
        },
        visible: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            isVisible: false,
            style: {
                zIndex: this.zIndex,
            },
        };
    },

    watch: {
        visible(_value) {
            this.isVisible = _value;
        },
    },

    mounted() {
        document.body.appendChild(this.$el);

        if (this.visible) {
            this.$nextTick(() => {
                this.show();
            });
        }
    },

    destroyed() {
        this.$el.remove();
    },

    methods: {
        show() {
            if (!this.isVisible) {
                this.isVisible = true;
            }
        },

        hide(_hiddenByClick = false) {
            if (this.isVisible) {
                this.isVisible = false;

                this.$nextTick(() => {
                    this.$emit('overlay-hide', _hiddenByClick);
                });
            }
        },

        onClick() {
            if (this.hideOnClick) {
                this.hide(true);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
