<template>
    <div class="f-card" :class="cssClass">
        <slot name="title">
            <h2 v-if="title" class="title">
                <template v-if="routeUrl">
                    <router-link :to="routeUrl">{{ title }}</router-link>
                </template>
                <template v-else-if="url">
                    <a :href="url" target="_blank" rel="nofollow">{{ title }}</a>
                </template>
                <template v-else>
                    {{ title }}
                </template>
            </h2>
        </slot>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        // Card title
        title: {
            type: String,
            default: '',
        },
        // Url of card's title link
        url: {
            type: String,
            default: '',
        },
        // Url of card's title <route-link>
        routeUrl: {
            type: Object,
            default() {
                return null;
            },
        },
        // No card style.
        off: {
            type: Boolean,
            default: false,
        },
        // Use hover animation.
        hover: {
            type: Boolean,
            default: false,
        },
        // Use zoom animation.
        zoomHover: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            pHover: this.hover,
        };
    },

    computed: {
        cssClass() {
            return {
                off: this.off,
                'f-card-hover': this.pHover,
                zoom: this.zoomHover,
            };
        },
    },

    /*
        render(_h) {
            return _h(
                'div', {
                    class: {
                        'f-card': true
                    },
                    scopedSlots: {
                        // default: props => createElement('span', props.text)
                        title: (props) => {
                            console.log(props);
                            return _h('h2', {
                                attrs: {
                                    class: 'title'
                                }
                            }, props.title);
                        }
                    }
                },
                [
                    this.$slots.default
                ]
            );
        }
*/
};
</script>

<style lang="scss">
@import 'style';
</style>
