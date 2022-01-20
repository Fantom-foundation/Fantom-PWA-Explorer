<template>
    <component :is="tag" class="fintersectionobserver">
        <slot></slot>
    </component>
</template>

<script>
/**
 * IntersectionObserver wrapper
 */
export default {
    name: 'FIntersectionObserver',

    props: {
        /** Tag name of the root element */
        tag: {
            type: String,
            default: 'div',
        },
        /** Selector for root element. Default is document */
        root: {
            type: String,
            default: '',
        },
        /** Margin around the root */
        rootMargin: {
            type: String,
            default: '',
        },
        /** Don't emit first 'entry' event */
        ignoreFirstEntry: {
            type: Boolean,
            default: false,
        },
    },

    created() {
        /** @type {IntersectionObserver} */
        this._intersectionObserver = null;
        this._firstEntry = true;
    },

    mounted() {
        this._intersectionObserver = new IntersectionObserver(
            _entry => {
                this.onIntersection(_entry);
            },
            {
                root: this.root ? document.querySelector(this.root) : null,
                rootMargin: this.rootMargin || undefined,
            }
        );

        this._intersectionObserver.observe(this.$el);
    },

    beforeDestroy() {
        if (this._intersectionObserver) {
            this._intersectionObserver.unobserve(this.$el);
            this._intersectionObserver = null;
        }
    },

    methods: {
        /**
         * @param {IntersectionObserverEntry[]} _entries
         */
        onIntersection(_entries) {
            if (this.ignoreFirstEntry && this._firstEntry) {
                this._firstEntry = false;
                return;
            }

            this.$emit('entry', _entries[0]);
        },
    },
};
</script>

<style scoped></style>
