import { isObject } from './index.js';

const lengthAndUnitRE = /([\d.]+)([\w%]*)/;

/**
 * Parse length of css property - like '200px', '50%', ...
 *
 * @param {string} _value
 * @return {{unit: string, len: number}}
 */
export function getLengthAndUnit(_value) {
    const match = typeof _value === 'string' ? lengthAndUnitRE.exec(_value) : null;
    const obj = { len: 0, unit: '' };

    if (match && match.length === 3) {
        obj.len = parseFloat(match[1]);
        // eslint-disable-next-line prefer-destructuring
        obj.unit = match[2];
    }

    return obj;
}

/**
 * @param {HTMLElement} _elem
 * @param {object} [_style]
 * @param {boolean} [_toFloat]
 * @return {object}
 */
export function getComputedStyle(_elem, _style, _toFloat) {
    let css = {};
    let cStyle;
    let val;
    let propVal;

    if (_elem) {
        cStyle = window.getComputedStyle(_elem);

        if (isObject(_style)) {
            for (const prop in _style) {
                if (prop in cStyle || (propVal = cStyle.getPropertyValue(prop)) !== '') {
                    // console.log('???', prop, prop.indexOf('--'));
                    if (propVal !== '') {
                        // css custom property
                        val = propVal;
                        propVal = '';
                    } else {
                        val = cStyle[prop];
                    }
                    // _style[prop] = cStyle[toKebabCase(prop)];
                    _style[prop] = val;

                    if (_toFloat) {
                        _style[prop] = parseFloat(_style[prop]);
                    }
                }
            }

            css = _style;
        } else {
            css = cStyle;
        }
    }

    return css;
}
