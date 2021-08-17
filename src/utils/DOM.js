import { deepExtend } from './index.js';

const alignmentRE = /\s*([lcrm][tcbm])\s+([lcrm][tcbm])\s*/;

/**
 * Helper for `attachElemTo()` function.
 *
 * @param {string} _char
 * @return {float} Number form interval <0, 1>.
 */
function getPercentsFromShortcut(_char) {
    let p = 0;

    if (_char === 'm') {
        // eslint-disable-next-line no-param-reassign
        _char = 'c';
    }

    if (_char === 'l' || _char === 't') {
        // left or top
        p = 0;
    } else if (_char === 'c') {
        // center
        p = 0.5;
    } else if (_char === 'r' || _char === 'b') {
        // right or bottom
        p = 1;
    }

    return p;
}

/**
 * @param {HTMLElement} _elem
 * @param {object} _style
 */
export function addStyle(_elem, _style) {
    if (_elem && _style) {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const prop in _style) {
            // eslint-disable-next-line no-param-reassign
            _elem.style[prop] = _style[prop];
        }
    }
}

/**
 * @param {HTMLElement} _elem
 * @param {String} _attrName
 * @return {string}
 */
export function getAttr(_elem, _attrName) {
    let attr = '';

    if (_elem && _attrName) {
        attr = _elem.getAttribute(_attrName);
        if (!attr) {
            return '';
        }
        attr = attr.trim();
    }

    return attr;
}

/**
 * @param {HTMLElement} _elem
 * @param {String} _attrName
 * @param {*} [_value]
 */
export function setAttr(_elem, _attrName, _value) {
    if (_elem && _attrName) {
        if (_value === undefined) {
            _elem.removeAttribute(_attrName);
        } else {
            _elem.setAttribute(_attrName, _value);
        }
    }
}

/**
 * @param {HTMLElement} _elem
 * @param {String} _attrName
 */
export function removeAttr(_elem, _attrName) {
    if (_elem && _attrName) {
        _elem.removeAttribute(_attrName);
    }
}

/**
 * Get elements by attribute and values.
 *
 * @param {String} _attr
 * @param {Array} _values
 * @param {HTMLElement} [_elem]
 * @return {NodeListOf<HTMLElementTagNameMap[*]>}
 */
export function getElementsBy(_attr, _values, _elem) {
    const elem = _elem || document.body;
    const selector = [];

    _values.forEach((_value) => selector.push(`[${_attr}="${_value}"]`));

    return elem.querySelectorAll(selector.join(','));
}

export function getViewportRect() {
    return {
        top: window.scrollY || window.pageYOffset,
        left: window.scrollX || window.pageXOffset,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    };
}

export function getElemRect(_elem) {
    const rect = {
        top: -1,
        left: -1,
        width: -1,
        height: -1,
    };
    let eBCRect;

    if (_elem) {
        eBCRect = _elem.getBoundingClientRect();

        rect.top = eBCRect.top + (window.scrollY || window.pageYOffset);
        rect.left = eBCRect.left + (window.scrollX || window.pageXOffset);
        rect.width = eBCRect.width;
        rect.height = eBCRect.height;
    }

    return rect;
}

/**
 *
 * @param {{top: number, left: number, width: number, height}} _rect
 * @param {{top: number, right: number, bottom: number, left: number}} _margin
 * @param _positionedBottom
 * @return {{top: number, left: number, bottom: number}|null|boolean}
 */
export function isRectOutOfViewport(_rect, _margin, _positionedBottom) {
    let vpRect;
    let margin;
    let pos = null;
    let eLW = 0;
    let sLW = 0;
    let eTH = 0;
    let sTH = 0;

    if (!_rect) {
        return null;
    }

    vpRect = getViewportRect();

    eLW = _rect.left + _rect.width;
    sLW = vpRect.left + vpRect.width;
    eTH = _rect.top + _rect.height;
    sTH = vpRect.top + vpRect.height;

    if (_rect.top >= vpRect.top && eTH <= sTH && _rect.left >= vpRect.left && eLW <= sLW) {
        return false;
    }
    margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    if (_margin) {
        deepExtend(margin, _margin);
    }

    pos = {
        left: -1,
        top: -1,
        bottom: -1,
    };

    if (_rect.left >= vpRect.left) {
        if (eLW > sLW) {
            pos.left = _rect.left - (eLW - sLW) - margin.right;
        }
    } else {
        pos.left = vpRect.left + margin.bottom;
    }

    if (_rect.top >= vpRect.top) {
        if (eTH > sTH) {
            pos.top = _rect.top - (eTH - sTH) - margin.left;
        }

        pos.bottom = _rect.height - (_rect.top - pos.top);
    } else {
        pos.top = vpRect.top + margin.top;

        if (_positionedBottom) {
            pos.bottom = _rect.height - (pos.top - _rect.top);
        } else {
            pos.bottom = vpRect.height - margin.top - margin.bottom;
        }
    }

    return pos;
}

/**
 * Check if element or element rectangle is out of viewport.
 * Method returns `false`, if whole element is inside viewport, else it
 * returns array [left, top] - position of top left corner of element
 * where it will be whole visible in viewport.
 *
 * @return {array|bool} [left, top]
 */
export function isElemOutOfViewport(_elem, _margin, _positionedBottom, _simple) {
    return isRectOutOfViewport(_elem.getBoundingClientRect(), _margin, _positionedBottom, _simple);
}

/**
 * Attach element `_elem1` to element `_elem2`, `_elem2` can be point - `[left, top]`.
 *
 * `_alignment` - how to attach elements - possible values are
 * 'rt' - right top
 * 'lt' - left top
 * 'rb' - right bottom
 * 'lb' - left bottom
 * 'ct' - center top
 * 'cb' - center bottom
 * 'lc' - left center
 * 'rc' - right center
 * 'cc' - center center
 *
 * @param {HTMLElement} _elem1.
 * @param {HTMLElement|array} _elem2 Element or point `[left, top]`.
 * @param {array} [_alignment] [_elem1Alignment, _elem2Alignment], defaults - `['lt', 'lb']`
 * @param {boolean} [_fitToViewport] Correct position so `_elem1` is in viewport.
 * @param {array} [_margin] Margin of element position. `[top, right, bottom, left]` - numbers (pixels)
 * @param {boolean} [_adjustHeight] Automatically adjust height of `_elem1`, if it overlaps viewport.
 * @param {boolean} [_elemFixed] Elements (`_elem1` and `_elem2`) are fixed (position: fixed).
 * @param {array} [_mousePos] `[left, top]`
 * @param {array} [_elem2Offset] `{left: ..., top: ...}` Add this offset to element 2 rect.
 * @return {{pos: *, elem1Rect: *, elem2Rect: *}|null}
 */
export function attachElemTo(
    _elem1,
    _elem2,
    _alignment,
    _fitToViewport,
    _margin,
    _adjustHeight,
    _elemFixed,
    _mousePos,
    _elem2Offset
) {
    if (!_elem1 || !_elem2) {
        return null;
    }

    let elem1Rect = null;
    let elem2Rect = null;
    let pos = null;
    let pos2 = null;
    const vpRect = getViewportRect();
    const alignment = _alignment || ['lt', 'lb'];
    let elem1C = '';
    let elem2C = '';
    let c = '';
    const css = {};
    const prPos = [0, 0, 0, 0]; // position in percents (<0, 1>), [elem1 hor, elem 1 ver, elem2 hor, elem2 ver]

    pos = [-1, -1];

    elem1Rect = getElemRect(_elem1);
    if (_elem2.length === 2) {
        // attach to point
        elem2Rect = {
            width: 1,
            height: 1,
            left: _elem2[0],
            top: _elem2[1],
        };
    } else {
        elem2Rect = getElemRect(_elem2);
    }

    if (_elemFixed) {
        elem2Rect.left -= vpRect.left;
        elem2Rect.top -= vpRect.top;
    }

    if (_elem2Offset) {
        elem2Rect.left += _elem2Offset.left;
        elem2Rect.top += _elem2Offset.top;
    }

    if (elem1Rect && elem2Rect) {
        elem1C = alignment[0];
        elem2C = alignment[1];

        // prPos = [0.5, 0, 1, 1];

        prPos[0] = getPercentsFromShortcut(elem1C.charAt(0));
        prPos[1] = getPercentsFromShortcut(elem1C.charAt(1));
        prPos[2] = getPercentsFromShortcut(elem2C.charAt(0));
        prPos[3] = getPercentsFromShortcut(elem2C.charAt(1));

        if (_mousePos) {
            if (elem1C.charAt(0) === 'm' || elem2C.charAt(0) === 'm') {
                elem2Rect.width = 1;
                elem2Rect.left = _mousePos[0];
            }
            if (elem1C.charAt(1) === 'm' || elem2C.charAt(1) === 'm') {
                elem2Rect.height = 1;
                elem2Rect.top = _mousePos[1];
            }
        }

        pos[0] = elem2Rect.left - elem1Rect.width * prPos[0] + elem2Rect.width * prPos[2];
        pos[1] = elem2Rect.top - elem1Rect.height * prPos[1] + elem2Rect.height * prPos[3];

        if (_margin) {
            c = elem1C.charAt(0);
            if (c === 'l') {
                pos[0] += _margin.left;
            } else if (c === 'r') {
                pos[0] -= _margin.right;
            }

            c = elem1C.charAt(1);
            if (c === 't') {
                pos[1] += _margin.top;
            } else if (c === 'b') {
                pos[1] -= _margin.bottom;
            }
        }
    }

    elem1Rect.left = pos[0];
    elem1Rect.top = pos[1];

    if (_fitToViewport) {
        pos2 = isRectOutOfViewport(
            {
                width: elem1Rect.width,
                height: elem1Rect.height,
                left: pos[0],
                top: pos[1],
            },
            _margin /* ,
            null,
            (elem1C.charAt(1) === 'b') */
        );

        if (pos2) {
            if (pos2.left !== -1) {
                pos[0] = pos2.left;
            }
            elem1Rect.left = pos[0];

            if (pos2.top !== -1) {
                if (_adjustHeight) {
                    // alert(pos2)
                    elem1Rect.height = pos2.height;
                    css.height = `${elem1Rect.height}px`;

                    if (elem1C.charAt(1) === 't') {
                        pos2.top = pos[1]; // don't change top position
                    }
                }

                pos[1] = pos2.top;
            }
            elem1Rect.top = pos[1];
        }
    }

    // kdyz bude prvek position: fixed
    /* viewport = ZPE.info.viewport;
    pos[0] -= vpRect.left;
    pos[1] -= vpRect.top; */

    css.left = `${pos[0]}px`;
    css.top = `${pos[1]}px`;

    elem1Rect.left = pos[0];
    elem1Rect.top = pos[1];

    addStyle(_elem1, css);

    return { elem1Rect, elem2Rect, pos: pos2 };
}

/**
 * Calculates, where is the most space in viewport for element (_elem1) attached to another element (_elem2)
 * and returns this attach position.
 *
 * @param {HTMLElement} _elem1
 * @param {HTMLElement} _elem2
 * @param {{top: number, right: number, bottom: number, left: number}} [_margin]
 * @return {{pos: 'top'|'right'|'bottom'|'left', top: number, right: number, bottom: number, left: number}}
 */
export function getAttachPosition(_elem1, _elem2, _margin) {
    return getAttachPositionByRects(getElemRect(_elem1), getElemRect(_elem2), _margin);
}

/**
 * Calculates, where is the most space in viewport for element (_elem1Rect) attached to another element (_elem2Rect)
 * and returns this attach position.
 *
 * @param {{top: number, left: number, width: number, height}} _elem1Rect
 * @param {{top: number, left: number, width: number, height}} _elem2Rect
 * @param {{top: number, right: number, bottom: number, left: number}} [_margin]
 * @return {{pos: 'top'|'right'|'bottom'|'left', top: number, right: number, bottom: number, left: number}}
 */
export function getAttachPositionByRects(_elem1Rect, _elem2Rect, _margin) {
    let top;
    let right;
    let bottom;
    let left;
    let direction;
    let pos = '';
    const vpRect = getViewportRect();

    if (_margin) {
        for (const prop in _margin) {
            _elem1Rect[prop] += _margin[prop];
        }
    }

    top = _elem2Rect.top - vpRect.top - _elem1Rect.height;
    right = vpRect.width - (_elem2Rect.left - vpRect.left + _elem2Rect.width) - _elem1Rect.width;
    bottom = vpRect.height - (_elem2Rect.top - vpRect.top + _elem2Rect.height) - _elem1Rect.height;
    left = _elem2Rect.left - vpRect.left - _elem1Rect.width;

    direction = Math.max(top, right, bottom, left);

    // First element touches attached element. Try to find position, where attached element will be the most visible.
    if (direction < 0) {
        top = _elem2Rect.height / top;
        right = _elem2Rect.width / right;
        bottom = _elem2Rect.height / bottom;
        left = _elem2Rect.width / left;

        direction = Math.min(top, right, bottom, left);
    }

    if (direction === bottom) {
        pos = 'bottom';
    } else if (direction === right) {
        pos = 'right';
    } else if (direction === top) {
        pos = 'top';
    } else if (direction === left) {
        pos = 'left';
    }

    // alert(pos + '\n' + _elem2Rect + '\n' + bRect)

    return {
        pos,
        top,
        right,
        bottom,
        left,
    };
}

/**
 * Get attach position from `_pos` if `_attachPosition` contains 'auto'.
 *
 * @param {{pos: 'top'|'right'|'bottom'|'left', top: number, right: number, bottom: number, left: number}} _pos
 * @param {string} _attachPosition
 * @param {string} [_preferredAttachPosition]
 */
export function getAutoAttachPosition(_pos, _attachPosition, _preferredAttachPosition) {
    let attachPosition = _attachPosition;
    let alignment;
    let c = '';
    let preferredAPIsOk = false;

    if (_pos && attachPosition.indexOf('auto') > -1) {
        if (attachPosition === 'auto') {
            if (_preferredAttachPosition) {
                alignment = getAlignment(_preferredAttachPosition);

                c = alignment[1].charAt(0);
                preferredAPIsOk =
                    (c === 'c' && (_pos.left > 0 || _pos.right > 0)) ||
                    (c === 'l' && _pos.left > 0) ||
                    (c === 'r' && _pos.right > 0);

                if (preferredAPIsOk) {
                    c = alignment[1].charAt(1);
                    preferredAPIsOk =
                        (c === 'c' && (_pos.top > 0 || _pos.bottom > 0)) ||
                        (c === 't' && _pos.top > 0) ||
                        (c === 'b' && _pos.bottom > 0);
                }
            }

            if (preferredAPIsOk) {
                attachPosition = _preferredAttachPosition;
            } else {
                // set auto-calculated position
                attachPosition = _pos.pos;
            }
        } else if (attachPosition === 'auto-vertical') {
            if (_pos.top > _pos.bottom) {
                attachPosition = 'top';
            } else {
                attachPosition = 'bottom';
            }
        } else if (attachPosition === 'auto-horizontal') {
            if (_pos.left > _pos.right) {
                attachPosition = 'left';
            } else {
                attachPosition = 'right';
            }
        }
    }

    return attachPosition;
}

/**
 * Get `attachElemTo()` alignment array from string.
 *
 * @param {string} _attachPosition 'bottom'|'top'|'left'|'right' or alignment string (e.g. 'lt lb').
 * @param {[string, string]} [_defaultAlignment]
 * @return {[string, string]}
 */
export function getAlignment(_attachPosition, _defaultAlignment) {
    let alignment = _defaultAlignment || ['lt', 'lb'];

    if (_attachPosition) {
        switch (_attachPosition) {
            case 'bottom':
                alignment = ['ct', 'cb'];
                break;
            case 'top':
                alignment = ['cb', 'ct'];
                break;
            case 'left':
                alignment = ['rc', 'lc'];
                break;
            case 'right':
                alignment = ['lc', 'rc'];
                break;
            default:
                alignment = parseAlignment(_attachPosition, alignment);
        }
    }

    return alignment;
}

/**
 * Parse `attachElemTo()` alignment array from string.
 *
 * @param {string} _alignmentStr
 * @param {[string, string]} [_defaultAlignment]
 * @return {[string, string]|null}
 */
export function parseAlignment(_alignmentStr, _defaultAlignment) {
    const match = alignmentRE.exec(_alignmentStr);
    let alignment = _defaultAlignment || null;

    if (match && match.length === 3) {
        alignment = [match[1], match[2]];
    } else {
        throw new Error('Bad attach position.');
    }

    return alignment;
}

export function isRTLDir() {
    return getAttr(document.documentElement, 'dir') === 'rtl' || getAttr(document.body, 'dir') === 'rtl';
}
