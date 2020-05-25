<template>
    <div class="f-tabs" :class="{ 'no-style': noStyle }">
        <ul role="tablist" class="no-markers" @click="onTabListClick" @keyup="onTabListKeyup">
            <li
                v-for="(tabPanel, idx) in dTabPanels"
                :id="ids[idx]"
                :key="`${ids[idx]}`"
                :tabindex="tabPanel.dActive ? 0 : -1"
                :aria-controls="tabPanel.id"
                :aria-selected="tabPanel.dActive"
                :aria-disabled="tabPanel.dDisabled"
                role="tab"
                :data-index="idx"
                :class="tabPanel.titleClass"
            >
                <template v-if="tabPanel.titleSlot"><slot :name="tabPanel.titleSlot"></slot></template>
                <template v-else>{{ tabPanel.title }}</template>
            </li>
        </ul>
        <div class="f-tabs-panels">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { helpersMixin } from '../../../mixins/helpers.js';
import { getUniqueId } from '../../../utils';
import { keyboardNavigation } from '../../../utils/aria.js';

/**
 * Simple tabs following WAI-ARIA practices.
 */
export default {
    name: 'FTabs',

    mixins: [helpersMixin],

    props: {
        /** No tablist style */
        noStyle: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            /** Tab ids */
            ids: [],
            /** Array of FTab instances */
            dTabPanels: [],
        };
    },

    mounted() {
        this.prepareTabs();
    },

    methods: {
        prepareTabs() {
            const tabPanels = this.getTabPanels();
            const ids = [];
            let tabPanel;
            let activePanelExists = false;

            for (let i = 0, len1 = tabPanels.length, id = ''; i < len1; i++) {
                id = getUniqueId();
                tabPanel = tabPanels[i];

                tabPanel.labelledBy = id;
                if (tabPanel.active) {
                    activePanelExists = true;
                }

                ids.push(id);
            }

            this.ids = ids;
            this.dTabPanels = tabPanels;

            if (!activePanelExists) {
                this.setActiveTabByIndex(0);
            }
        },

        /**
         * @return {FTab[]}
         */
        getTabPanels() {
            return this.findChildrenByName('f-tab');
        },

        /**
         * Deactivate currently active panel.
         */
        deactivateActivePanel() {
            const { dTabPanels } = this;

            for (let i = 0, len1 = dTabPanels.length; i < len1; i++) {
                if (dTabPanels[i].dActive) {
                    dTabPanels[i].dActive = false;
                    break;
                }
            }
        },

        /**
         * @param {int} _index
         */
        setActiveTabByIndex(_index) {
            const tabPanel = this.dTabPanels[_index];

            if (!tabPanel.dDisabled) {
                this.deactivateActivePanel();

                tabPanel.dActive = true;

                this.$emit('tab-set', { tabId: tabPanel.id });
            }
        },

        /**
         * @param {HTMLElement} _elem
         * @return {int}
         */
        getTabIndexByElem(_elem) {
            const eLi = _elem.closest('li');

            return eLi ? parseInt(eLi.getAttribute('data-index')) : -1;
        },

        /**
         * @param {MouseEvent} _event
         */
        onTabListClick(_event) {
            const tabIndex = this.getTabIndexByElem(_event.target);

            if (tabIndex > -1) {
                this.setActiveTabByIndex(tabIndex);
            }
        },

        /**
         * @param {KeyboardEvent} _event
         */
        onTabListKeyup(_event) {
            const elem = keyboardNavigation(_event, '[role="tab"]:not([aria-disabled="true"])', true);

            if (elem) {
                const tabIndex = this.getTabIndexByElem(elem);

                if (tabIndex > -1) {
                    this.setActiveTabByIndex(tabIndex);
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
