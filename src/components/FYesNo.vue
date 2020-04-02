<template>
    <span class="f-yes-no" :class="cClass">
        {{ value ? dYes : dNo }}
    </span>
</template>

<script>
    // formatter for boolean values
    export default {
        props: {
            // value to format
            value: {
                type: Boolean,
                default: false,
                required: true
            },
            // 'yes' translation
            yes: {
                type: String,
                default: ''
            },
            // 'no' translation
            no: {
                type: String,
                default: ''
            },
            // style text
            useColors: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                dYes: this.yes || this.$t('yes'),
                dNo: this.no || this.$t('no')
            }
        },

        computed: {
            cClass() {
                return {
                    yes: this.value,
                    no: !this.value,
                    'use-colors': this.useColors
                }
            }
        }
    }
</script>

<style lang="scss">
    .f-yes-no {
        &.use-colors {
            &.yes {
                color: $success-color;
            }

            &.no {
                color: $error-color;
            }
        }
    }
</style>
