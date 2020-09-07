/**
 * Functions for sorting array with objects as items.
 */

import { getNestedProp } from "./index.js";

/**
 * @param {string} _a
 * @param {string} _b
 * @return {number}
 */
export function stringSort(_a, _b) {
    return _a.localeCompare(_b);
}

/**
 * @param {string} _itemProp Name of object's property. Can be nested - 'prop1.prop2'
 * @param {'asc'|'desc'} [_direction]
 * @return {number}
 */
export function sortByString(_itemProp, _direction = 'asc') {
    return (_a, _b) => {
        const a = getNestedProp(_a, _itemProp);
        const b = getNestedProp(_b, _itemProp);

        if ((a === null) || (b === null)) {
            return 0;
        }

        return (_direction === 'desc' ? -1 : 1) * stringSort(a, b);
    };
}

/**
 * @param {string} _itemProp Name of object's property. Can be nested - 'prop1.prop2'
 * @param {'asc'|'desc'} [_direction]
 * @return {number}
 */
export function sortByLocaleString(_itemProp, _direction = 'asc') {
    return (_a, _b) => {
        const a = getNestedProp(_a, _itemProp);
        const b = getNestedProp(_b, _itemProp);

        if ((a === null) || (b === null)) {
            return 0;
        }

        return (_direction === 'desc' ? -1 : 1) * a.localeCompare(b, 'en-GB');
    };
}

/**
 * @param {number} _a
 * @param {number} _b
 * @return {number}
 */
export function numberSort(_a, _b) {
    return _a - _b;
}

/**
 * @param {string} _itemProp Name of object's property. Can be nested - 'prop1.prop2'
 * @param {'asc'|'desc'} [_direction]
 * @return {number}
 */
export function sortByNumber(_itemProp, _direction = 'asc') {
    return (_a, _b) => {
        const a = getNestedProp(_a, _itemProp);
        const b = getNestedProp(_b, _itemProp);

        if ((a === null) || (b === null)) {
            return 0;
        }

        return (_direction === 'desc' ? -1 : 1) * numberSort(a, b);
    };
}

/**
 * "Port" of https://github.com/mrDarcyMurphy/hexadecimal-sort
 *
 * @param {string} _a
 * @param {string} _b
 * @return {number}
 */
function hexadecimalSort(_a, _b) {
    const ax = parseInt(_a,16);
    const bx = parseInt(_b,16);

    if (isNaN(ax)) {
        throw new Error("First value is not a hexidecimal number");
    }

    if (isNaN(bx)) {
        throw new Error("Second value is not a hexidecimal number");
    }

    // easiest check
    if (ax < bx) {
        return -1;
    }
    if (ax > bx) {
        return  1;
    }

    // If it's a really big hexadecimal number, such as a BSON ID,
    // then parsing it creates the largest number javascript can handle: 2.5282188864409287e+28
    // If they're both valid hex values, but both convert to that number, then a check on string length will be enough
    if ((typeof _a == 'string') && (typeof _b == 'string')) {
        if (_a.length < _b.length) {
            return -1;
        }
        if (_a.length > _b.length) {
            return  1;
        }
    }

    // otherwise, look through each character and figure out what's going on
    let x, y;
    for (let i = 0, l = _a.length; i < l; i+=1) {
        x = parseInt(_a[i], 16);
        y = parseInt(_b[i], 16);

        if (x < y) {
            return -1;
        }
        if (x > y) {
            return  1;
        }
    }

    return 0
}

/**
 * @param {string} _itemProp Name of object's property. Can be nested - 'prop1.prop2'
 * @param {'asc'|'desc'} [_direction]
 * @return {number}
 */
export function sortByHex(_itemProp, _direction) {
    return (_a, _b) => {
        const a = getNestedProp(_a, _itemProp);
        const b = getNestedProp(_b, _itemProp);

        if ((a === null) || (b === null)) {
            return 0;
        }

        return (_direction === 'desc' ? -1 : 1) * hexadecimalSort(a, b);
    };
}
