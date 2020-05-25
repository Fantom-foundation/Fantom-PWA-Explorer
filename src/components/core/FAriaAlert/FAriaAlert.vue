<template>
    <div role="alert" aria-atomic="true" class="not-visible">
        <span v-for="msg in cMessages" :key="msg.id">{{ msg.text }}</span>
    </div>
</template>

<script>
import { eventBusMixin } from '../../../mixins/event-bus.js';
import { helpersMixin } from '../../../mixins/helpers.js';

/**
 * Notifies assistive technologies about important messages - input errors etc.
 * Listens to these events on event bus:
 * 'aria-alert-append', 'aria-alert-replace' and 'aria-alert-clear'
 */
export default {
    mixins: [eventBusMixin, helpersMixin],

    data() {
        return {
            // alert messages
            messages: [],
        };
    },

    computed: {
        cMessages() {
            this.setIds(this.messages);

            return this.messages;
        },
    },

    created() {
        this._eventBus.on('aria-alert-append', this.append);
        this._eventBus.on('aria-alert-replace', this.replace);
        this._eventBus.on('aria-alert-clear', this.clear);
    },

    methods: {
        /**
         * @param {string} _msg
         */
        append(_msg) {
            this.messages.push({ text: _msg });
        },
        /**
         * @param {string} _msg
         */
        replace(_msg) {
            this.messages = [{ text: _msg }];
        },
        clear() {
            this.messages = [];
        },
    },
};
</script>
