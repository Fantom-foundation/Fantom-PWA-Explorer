import animeEs from 'animejs';
import {defer} from "@/utils/index.js";

export class GridRowsAnimation {
    _prevItems = [];

    _itemIdPropName = '';

    _rowsSelector = '';

    _animationOptions = {};

    constructor({
        itemIdPropName = 'id',
        rowsSelector = 'tr[data-fdg-id="ITEM_ID"]',
        animationOptions = {},
    }) {
        this._itemIdPropName = itemIdPropName;
        this._rowsSelector = rowsSelector;
        this._animationOptions = animationOptions;
    }

    animate(items) {
        const targets = this._getAnimationTargets(this._getNewItems(items));

        if (targets) {
            defer(() => {
                animeEs({
                    targets,
                    // translateX: 0,
                    translateX: ['-60%', 0],
                    opacity: [0, 1],
                    easing: 'easeInOutQuad',
                    duration: 250,
                    // delay: 1000,
                    delay: animeEs.stagger(60, {}),
                    // delay: animeEs.stagger(60, { direction: 'reverse' }),
                    ...this._animationOptions,
                    begin: () => {
                        this._blurClass('add', targets);
                    },
                    complete: () => {
                        this._blurClass('remove', targets);
                    },
                });
            });
        }
    }

    _getNewItems(items) {
        const itemIdPropName = this._itemIdPropName;
        let newItems = [];
        const nItems = items.map((item) => typeof itemIdPropName === 'function' ? itemIdPropName(item) : item[itemIdPropName]);
        const prevItems = this._prevItems;

        if (prevItems.length === 0) {
            newItems = nItems;
        } else {
            for (let i = 0, len = nItems.length; i < len; i++) {
                if (!prevItems.includes(nItems[i])) {
                    newItems.push(nItems[i]);
                } else {
                    break;
                }
            }
        }

        this._prevItems = nItems;

        return newItems;
    }

    _getAnimationTargets(newItems) {
        const rowsSelector = this._rowsSelector;
        let targets = '';

        if (Array.isArray(newItems) && newItems.length > 0) {
            targets = newItems
                // .map((itemId) => `.recentblocklist tr[data-fdg-id="${itemId}"]`)
                .map((itemId) => rowsSelector.replace('ITEM_ID', itemId))
                .join(',');
        }

        return targets;
    }

    _blurClass(type, targets) {
        const trs = document.querySelectorAll(targets);

        if (trs.length > 0) {
            if (type === 'add') {
                trs.forEach((tr) => tr.classList.add('blur'));
            } else {
                trs.forEach((tr) => tr.classList.remove('blur'));
            }
        }
    }
}
