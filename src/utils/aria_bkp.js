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
 *
 * @param {KeyboardEvent} _event
 * @param {string} _selector
 * @param {boolean} [_circular] Circular keyboard navigation
 * @return {HTMLElement|null} Next or previous element or null.
 */
export function keyboardNavigation(_event, _selector, _circular) {
    if (!_event || !(_event.type in KEY_EVENTS) || !_selector) {
        return null;
    }

    let elem = null;
    // const { keyCode } = _event;
    const eTarget = _event.target.closest(_selector);

    // console.log(_event.code);

    if (eTarget) {
        if (isKey('ArrowRight', _event) || isKey('ArrowUp', _event)) {
            elem = eTarget.nextElementSibling;
            while (elem && !elem.matches(_selector)) {
                elem = elem.nextElementSibling;
            }

            if (_circular && elem === null) {
                elem = eTarget.parentElement.firstElementChild;
                while (elem && !elem.matches(_selector)) {
                    elem = elem.nextElementSibling;
                }
            }
        } else if (isKey('ArrowLeft', _event) || isKey('ArrowDown', _event)) {
            elem = eTarget.previousElementSibling;
            while (elem && !elem.matches(_selector)) {
                elem = elem.previousElementSibling;
            }

            if (_circular && elem === null) {
                elem = eTarget.parentElement.lastElementChild;
                while (elem && !elem.matches(_selector)) {
                    elem = elem.previousElementSibling;
                }
            }
        }
    }

    if (elem) {
        elem.focus();
    }

    return elem;
}
