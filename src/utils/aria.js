const RECEIVE_FOCUS_FROM_ATTR = 'data-receive-focus-from';

const KEY_EVENTS = {
    keyup: null,
    keydown: null,
};

export function isKey(_key, _event) {
    let isKey = false;

    if (_event) {
        switch (_event.key) {
            case 'Esc': // IE/Edge
            case 'Escape':
                isKey = _key === 'Escape';
                break;
            case 'Up': // IE/Edge
            case 'ArrowUp':
                isKey = _key === 'ArrowUp';
                break;
            case 'Right': // IE/Edge
            case 'ArrowRight':
                isKey = _key === 'ArrowRight';
                break;
            case 'Left': // IE/Edge
            case 'ArrowLeft':
                isKey = _key === 'ArrowLeft';
                break;
            case 'Down': // IE/Edge
            case 'ArrowDown':
                isKey = _key === 'ArrowDown';
                break;
            case 'Spacebar': // IE/Edge
            case ' ':
                isKey = _key === ' ';
                break;
            default:
                isKey = _key === _event.key;
        }
    }

    return isKey;
}

/**
 * Is element visible? Fast method, but not accurate, if fixed element is on page.
 * (window.getComputedStyle(el) (style.display === 'none') -> much slower).
 *
 * @param {HTMLElement} _elem
 * @return {boolean}
 */
export function isVisible(_elem) {
    return !!_elem && _elem.offsetParent !== null;
}

/**
 * @param {HTMLElement} _elem
 * @return {boolean}
 */
export function isFocusable(_elem) {
    let focusable = false;

    if (!_elem || _elem.disabled) {
        return false;
    }

    switch (_elem.nodeName) {
        case 'INPUT':
            focusable = _elem.type !== 'hidden' && _elem.type !== 'file';
            break;
        case 'A':
            focusable = !!_elem.href && _elem.rel !== 'ignore';
            break;
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA':
            focusable = true;
            break;
        default:
            focusable = false;
    }

    if (!focusable) {
        focusable = _elem.tabIndex > 0 || (_elem.tabIndex === 0 && _elem.getAttribute('tabIndex') !== null);
    }

    if (focusable) {
        focusable = isVisible(_elem);
    }

    return focusable;
}

/**
 * @param {HTMLElement} _elem
 * @return {HTMLElement|null}
 */
export function findFirstFocusableDescendant(_elem) {
    let focusableElem = null;
    let childNodes;
    let child;

    if (_elem) {
        childNodes = _elem.assignedNodes ? _elem.assignedNodes() : _elem.childNodes;

        // Edge/IE
        if (!childNodes && _elem.assignedNodes) {
            childNodes = _elem.childNodes;
        }

        if (childNodes) {
            for (let i = 0, len1 = childNodes.length; i < len1; i += 1) {
                child = childNodes[i];
                if (child.nodeType === 1) {
                    if (isFocusable(child)) {
                        focusableElem = child;
                        break;
                    } else {
                        focusableElem = findFirstFocusableDescendant(child);
                        if (focusableElem) {
                            break;
                        }
                    }
                }
            }
        }
    }

    return focusableElem;
}

/**
 * @param {HTMLElement} _elem
 * @return {HTMLElement|null}
 */
export function findLastFocusableDescendant(_elem) {
    let focusableElem = null;
    let childNodes;
    let child;

    if (_elem) {
        childNodes = _elem.assignedNodes ? _elem.assignedNodes() : _elem.childNodes;

        // Edge/IE
        if (!childNodes && _elem.assignedNodes) {
            childNodes = _elem.childNodes;
        }

        if (childNodes) {
            for (let i = childNodes.length - 1; i >= 0; i -= 1) {
                child = childNodes[i];
                if (child.nodeType === 1) {
                    // console.log('la', child.assignedNodes, (child.assignedNodes ? child.assignedNodes() : ''));
                    if (isFocusable(child)) {
                        // return child;
                        focusableElem = child;
                        break;
                    } else {
                        focusableElem = findLastFocusableDescendant(child);
                        if (focusableElem) {
                            break;
                        }
                    }
                }
            }
        }
    }

    return focusableElem;
}

/**
 * @param {string} _id
 */
export function returnFocus(_id) {
    const elem = document.querySelector(`[${RECEIVE_FOCUS_FROM_ATTR}="${_id}"]`);

    if (elem) {
        elem.removeAttribute(RECEIVE_FOCUS_FROM_ATTR);
        elem.focus();
    } else {
        document.body.focus();
    }
}

/**
 * Set `RECEIVE_FOCUS_FROM_ATTR` attribute to an element with focus.
 * @param {string} _id
 */
export function setReceiveFocusFromAttr(_id) {
    if (document.activeElement) {
        document.activeElement.setAttribute(RECEIVE_FOCUS_FROM_ATTR, _id);
    }
}

/**
 *
 * @param {MouseEvent|KeyboardEvent} _event
 * @return {boolean}
 */
export function isAriaAction(_event) {
    if (!_event) {
        return false;
    }

    const eventType = _event.type;

    if (eventType === 'click') {
        return true;
    }

    return eventType in KEY_EVENTS && (isKey('Enter', _event) || isKey(' ', _event));
}

/**
 * Trap focus inside an element.
 *
 * @param {KeyboardEvent} _event
 * @param {HTMLElement} _elem
 * @param {{first: HTMLElement, last: HTMLElement}} _focusableElems
 */
export function focusTrap(_event, _elem, _focusableElems) {
    if (isKey('Tab', _event)) {
        if (!_focusableElems.first) {
            _focusableElems.first = findFirstFocusableDescendant(_elem);
        }
        if (!_focusableElems.last) {
            _focusableElems.last = findLastFocusableDescendant(_elem);
        }

        if (_event.target === _focusableElems.first && _event.shiftKey) {
            if (_focusableElems.last) {
                _event.preventDefault();
                _focusableElems.last.focus();
            }
        } else if (_event.target === _focusableElems.last && !_event.shiftKey) {
            if (_focusableElems.first) {
                _event.preventDefault();
                _focusableElems.first.focus();
            }
        }
    }
}

/**
 * @param {HTMLElement} _eTarget
 * @param {string} _selector
 * @return {HTMLElement|null}
 */
export function getFirstElement(_eTarget, _selector) {
    let elem = _eTarget && _eTarget.parentElement ? _eTarget.parentElement.firstElementChild : null;

    while (elem && !elem.matches(_selector)) {
        elem = elem.nextElementSibling;
    }

    return elem;
}

/**
 * @param {HTMLElement} _eTarget
 * @param {string} _selector
 * @return {HTMLElement|null}
 */
export function getLastElement(_eTarget, _selector) {
    let elem = _eTarget && _eTarget.parentElement ? _eTarget.parentElement.lastElementChild : null;

    while (elem && !elem.matches(_selector)) {
        elem = elem.previousElementSibling;
    }

    return elem;
}

/**
 *
 * @param {KeyboardEvent} _event
 * @param {string} _selector Item selector.
 * @param {('horizontal' | 'vertical' | 'both')} [_direction] Movement direction.
 * @param {boolean} [_circular] Circular keyboard navigation
 * @param {HTMLElement} [_target]
 * @param {boolean} [_focusElem] Focus found element.
 * @param {boolean} [_useHomeAndEnd] `Home` and `End` keys are enabled.
 * @return {HTMLElement|null} Next or previous element or null.
 */
export function keyboardNavigation({
    _event,
    _selector,
    _direction = 'horizontal',
    _circular = false,
    _target = null,
    _focusElem = true,
    _useHomeAndEnd = true,
}) {
    if (!_event || !(_event.type in KEY_EVENTS) || !_selector) {
        return null;
    }

    const eTarget = _target || _event.target.closest(_selector);
    let elem = null;
    let move = '';

    // console.log(_event.code);

    if (eTarget) {
        if (_direction === 'horizontal' || _direction === 'both') {
            if (isKey('ArrowRight', _event)) {
                move = 'next';
            } else if (isKey('ArrowLeft', _event)) {
                move = 'prev';
            }
        }

        if (!move && (_direction === 'vertical' || _direction === 'both')) {
            if (isKey('ArrowDown', _event)) {
                move = 'next';
            } else if (isKey('ArrowUp', _event)) {
                move = 'prev';
            }
        }

        if (_useHomeAndEnd && !move) {
            if (isKey('Home', _event)) {
                move = 'first';
            } else if (isKey('End', _event)) {
                move = 'last';
            }
        }

        if (move === 'next') {
            elem = eTarget.nextElementSibling;
            while (elem && !elem.matches(_selector)) {
                elem = elem.nextElementSibling;
            }

            if (_circular && elem === null) {
                elem = getFirstElement(eTarget, _selector);
            }
        } else if (move === 'prev') {
            elem = eTarget.previousElementSibling;
            while (elem && !elem.matches(_selector)) {
                elem = elem.previousElementSibling;
            }

            if (_circular && elem === null) {
                elem = getLastElement(eTarget, _selector);
            }
        } else if (move === 'first') {
            elem = getFirstElement(eTarget, _selector);
        } else if (move === 'last') {
            elem = getLastElement(eTarget, _selector);
        }
    }

    if (elem && _focusElem) {
        elem.focus();
    }

    return elem;
}
