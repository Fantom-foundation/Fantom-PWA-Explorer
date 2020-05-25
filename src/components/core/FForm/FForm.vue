<template>
    <form
        ref="form"
        method="post"
        class="f-form"
        :class="{ 'center-form': centerForm }"
        novalidate
        @submit="onSubmit"
        @change="onChange"
        @input="onInput"
    >
        <slot></slot>
    </form>
</template>

<script>
import events from '../../../mixins/events.js';
import { isArray } from '../../../utils';
import { eventBusMixin } from '../../../mixins/event-bus.js';

export default {
    mixins: [events, eventBusMixin],

    props: {
        /** Submit form when an element is changed */
        submitOnChange: {
            type: Boolean,
            default: false,
        },
        /** Call preventDefault() on form submit event. */
        cancelSubmit: {
            type: Boolean,
            default: true,
        },
        /** Center form body. */
        centerForm: {
            type: Boolean,
            default: false,
        },
    },

    created() {
        /**
         * Reference to last changed form element
         * @type {HTMLElement}
         */
        this._lastChangedElem = null;
    },

    mounted() {
        this.$refs.form = this.$el.querySelector('form') || this.$el;
    },

    methods: {
        /**
         * Get form element by its name.
         *
         * @param {String} _name
         * @return {HTMLElement|null}
         */
        getElement(_name) {
            const eForm = this.$refs.form;

            if (_name && eForm) {
                return eForm.querySelector(`[name=${_name}]`);
            }

            return null;
        },

        /**
         * Get form elements by names.
         *
         * @param {Array} [_names] Form elements names.
         * @param {HTMLElement} [_container]
         * @return {NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element> | NodeListOf<SVGElementTagNameMap[string]> | *}
         */
        getElements(_names, _container) {
            const container = _container || this.$refs.form;

            return container.querySelectorAll(
                isArray(_names) ? _names.map((_name) => `[name="${_name}"]`).join(',') : '[name]'
            );
        },

        getElementValue(_elem) {
            let value = null;

            if (!_elem) {
                return value;
            }

            if (!_elem.disabled) {
                // && !_elem.hasAttribute('readonly')) {
                if (_elem.nodeName === 'INPUT') {
                    if (_elem.type === 'checkbox' || _elem.type === 'radio') {
                        if (_elem.checked) {
                            value = _elem.value;
                            // value = (_elem.value === 'on' ? true : _elem.value);
                        }
                        // alert(_elem.checked + ' ' + value);
                    } else if (_elem.type === 'file') {
                        value = _elem.files;
                    } else {
                        value = _elem.value;
                    }
                } else {
                    value = _elem.value;
                }
            }

            return value;
        },

        /**
         * @param {Array} [_names] Form elements names.
         * @return {Object}
         */
        getElementsValues(_names) {
            const data = {};

            this.getElements(_names).forEach((_elem) => {
                const value = this.getElementValue(_elem);

                if (value !== null && _elem.name) {
                    if (_elem.name in data) {
                        if (isArray(data[_elem.name])) {
                            data[_elem.name].push(value);
                        } else {
                            data[_elem.name] = [data[_elem.name], value]; // ??
                        }
                    } else {
                        data[_elem.name] = value;
                    }
                }
            });

            return data;
        },

        /**
         * Submit form.
         */
        submit() {
            const eForm = this.$refs.form;
            let eSubmitBtn = eForm.querySelector('[type="submit"]');

            /*
                if (!eSubmitBtn) {
                    eSubmitBtn = createElement({
                        name: 'button',
                        attributes: {
                            type: 'submit',
                            style: 'display: none;'
                        }
                    });

                    eForm.appendChild(eSubmitBtn);
                }
*/

            eSubmitBtn.click();
        },

        /**
         * Reset form.
         */
        reset() {
            this.$refs.form.reset();
        },

        getErrorMessages() {
            const errorMessages = [];
            const elements = this.$refs.form.elements;
            let elem;

            if (elements) {
                for (let i = 0, len1 = elements.length; i < len1; i++) {
                    elem = elements[i];
                    if (elem.name && elem.willValidate && !elem.checkValidity()) {
                        // console.log(elem.name, elem.validity, elem.validationMessage);
                        errorMessages.push(elem.validationMessage);
                    }
                }
            }

            return errorMessages;
        },

        /**
         * Check form validity.
         *
         * @return {Boolean}
         */
        checkValidity() {
            const children = this.$children;
            let valid = true;
            let child;

            if (this.$refs.form) {
                for (let i = 0, len1 = children.length; i < len1; i++) {
                    child = children[i];
                    if (typeof child.validate === 'function') {
                        child.validate(true);
                    }
                }

                valid = this.$refs.form.checkValidity();
                if (!valid) {
                    const errorMessages = this.getErrorMessages();

                    if (errorMessages.length > 0) {
                        this._eventBus.emit('aria-alert-replace', errorMessages.join(''));
                    }

                    this.emitCustomEvent('f-form-not-valid');
                }

                return valid;
            }

            return valid;
        },

        /**
         * Triggered when form element changes.
         *
         * @param {Event} _event
         */
        onChange(_event) {
            // this.getElementValue()
            this.emitCustomEvent('f-form-change', {
                eTarget: _event.target,
                value: this.getElementValue(_event.target),
                // originalEvent: _event
            });

            if (this.submitOnChange) {
                this._lastChangedElem = _event.target;

                this.submit();

                this._lastChangedElem = null;
            }
        },

        /**
         * Triggered on form submit.
         *
         * @param {Event} _event
         */
        onSubmit(_event) {
            if (this.cancelSubmit) {
                _event.preventDefault();
            }

            if (
                !this.checkValidity() ||
                !this.emitCustomEvent('f-form-submit', {
                    data: this.getElementsValues(),
                    lastChangedElem: this._lastChangedElem,
                    action: this._submitAction,
                    method: this.method,
                })
            ) {
                _event.preventDefault();

                this._submitAction = this.action;
            }
        },

        /**
         * Triggered on form element input event.
         *
         * @param {Event} _event
         */
        onInput(_event) {
            this.emitCustomEvent('f-form-input', {
                eTarget: _event.target,
                value: this.getElementValue(_event.target),
                // originalEvent: _event
            });
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
