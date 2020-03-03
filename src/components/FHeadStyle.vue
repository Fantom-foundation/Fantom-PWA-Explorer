<template>
    <div style="display: none"></div>
</template>

<script>
    /**
     * Creates `<style>` element in the `<head>` element.
     */
    export default {
        props: {
            /**  */
            css: {
                type: String,
                default: '',
                required: true
            }
        },

        created() {
            /** Holds reference to `<style>` element. */
            this._styleElem = null;
            /** Text inside `<style>` element. */
            this._styleText = null;
        },

        mounted() {
            this.setCss(this.css);
        },

        beforeDestroy() {
            this.removeStyleElement();
        },

        watch: {
            css(_new) {
                this.setCss(_new);
            }
        },

        methods: {
            /**
             * @param {string} _css
             */
            setCss(_css) {
                this.createStyleElement();

                if (this._styleText) {
                    this._styleText.textContent = _css || '';
                }
            },

            /**
             * Create and append `<style>` element to `<head>` element.
             */
            createStyleElement() {
                let styleElem = this._styleElem;

                if (styleElem === null) {
                    styleElem = document.createElement('style');
                    styleElem.setAttribute('type', 'text/css');

                    this._styleElem = styleElem;
                    this._styleText = document.createTextNode('');

                    styleElem.appendChild(this._styleText);
                    document.head.appendChild(styleElem);
                }
            },

            removeStyleElement() {
                if (this._styleElem !== null) {
                    this._styleElem.remove();
                    this._styleElem = null;
                }
            }
        }
    }
</script>
