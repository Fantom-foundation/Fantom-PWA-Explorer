<template>
    <span class="f-placeholder" :class="classes">
        <template v-if="contentLoaded"><slot></slot></template>
        <template v-else>
            <span class="replacement-twin">{{ replacement || '&nbsp;' }}</span>
            <span class="replacement">{{ replacement || '&nbsp;' }}</span>
        </template>
    </span>
</template>

<script>
/**
 * Placeholder for a content. Waits for `contentLoaded` to be `true`, meanwhile it shows not visible replacement element
 * with background animation.
 */
export default {
    name: 'FPlaceholder',

    props: {
        /** Determines whether the content is loaded or not. */
        contentLoaded: {
            type: Boolean,
            default: false,
        },
        /** Text to be used in replacement element (not visible). */
        replacementText: {
            type: String,
            default: '',
        },
        /** Number of characters of replacement text (if `replacementText` is not set). */
        replacementNumChars: {
            type: Number,
            default: 0,
        },
        /** Character used in replacement text if `replacementNumChars` is set. */
        replacementChar: {
            type: String,
            default: 'M',
        },
        /** Display placeholder as block. */
        block: {
            type: Boolean,
            default: false,
        },
        /** Animate background. */
        animateBackground: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            loremIpsum:
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid ipsam magni nam odit praesentium temporibus vel voluptates voluptatibus. Aliquam atque autem cum dolores iure minus officia quibusdam quis vel voluptates!</div><div>Dicta numquam officiis placeat sed tempore? Consequatur corporis deserunt doloribus, eaque earum enim, ex facere fugiat, hic id iusto minima nisi obcaecati perferendis repellat sunt tempora voluptate! Distinctio, laborum quia.</div><div>Architecto debitis dicta doloremque dolores eligendi enim error exercitationem, explicabo fugiat hic labore laudantium molestias nesciunt nihil obcaecati porro voluptas voluptate voluptatem. Blanditiis, culpa dignissimos odio porro provident quam velit!',
        };
    },

    computed: {
        replacement() {
            let replacement = this.replacementText;

            if (replacement === '' && this.replacementNumChars > 0) {
                // replacement = new Array(this.replacementNumChars).fill(this.replacementChar).join('');
                replacement = this.loremIpsum.slice(0, this.replacementNumChars);
            }

            return replacement;
        },
        classes() {
            return {
                'placeholder-on': !this.contentLoaded,
                'is-block': this.block,
                'background-animation-on': this.animateBackground,
            };
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.setBackgroundSize();
        });
    },

    methods: {
        setBackgroundSize() {
            let width = 0;

            if (this.block) {
                width = this.$el.clientWidth;
            } else if (!this.contentLoaded) {
                const eTwin = this.$el.querySelector('.replacement-twin');

                if (eTwin) {
                    const elStyle = window.getComputedStyle(this.$el);

                    eTwin.style.padding = elStyle.padding;
                    eTwin.style.fontSize = elStyle.fontSize;
                    eTwin.style.fontFamily = elStyle.fontFamily;

                    width = eTwin.clientWidth;
                }
            }

            if (width > 0) {
                this.$el.style.setProperty('--f-placeholder-background-size-width', `${width * 2}px`);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
