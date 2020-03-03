const uppercaseCharsRE = /([A-Z])/;
const camelSplitRE = /[ _-]+/;
const kebabSplitRE = /([A-Z]|[ _-]+)/;

/**
 * Stringify object, skip cyclic objects.
 *
 * @param {object} _obj
 * @param {array|object} [_except] Regular expression or array of attributes names, which shouldn't be serialized.
 * @param {bool} [_encode]
 * @return {string}
 */
export function serializeObject(_obj, _except, _encode) {
    let seen = [];
    let regExpUsed = false;
    let so = '';

    if (_except) {
        regExpUsed = _except instanceof RegExp;
    }

    so = JSON.stringify(_obj, (_key, _val) => {
        if (_except && (regExpUsed ? _except.test(_key) : inArray(_key, _except) >= 0)) {
            return;
        }
        if (typeof _val === 'object') {
            seen.push(_val);
        } else if (typeof _val === 'function') {
            return;
        }

        // eslint-disable-next-line consistent-return
        return _val;
    });

    if (_encode) {
        so = encodeURIComponent(so);
    }

    seen = null;

    // alert(so)

    return so;
}

/**
 * Clone object.
 *
 * @param {object} _obj
 * @param {array|object} [_except] Regular expression or array of attributes names to be skipped, when cloning.
 * @return {object}
 */
export function cloneObject(_obj, _except) {
    return _obj ? JSON.parse(serializeObject(_obj, _except)) : {};
}

/**
 * @param {object} _obj
 * @return {boolean}
 */
export function isObjectEmpty(_obj) {
    return (Object.keys(_obj).length === 0) && (_obj.constructor === Object);
}

/**
 * Based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
 *
 * @param {*} _obj
 * @return {boolean}
 */
export function isObject(_obj) {
    return Object.prototype.toString.call(_obj) === '[object Object]';
}

/**
 * @param {*} _obj
 * @return {boolean}
 */
export function isArray(_obj) {
    return Array.isArray(_obj);
    // return Object.prototype.toString.call(_obj) === '[object Array]';
}

/**
 *
 * @param {int} _i
 * @param {Array} _ar
 * @return {boolean}
 */
export function isValidIndex(_i, _ar) {
    return isArray(_ar) && (_i >= 0) && (_i < _ar.length);
}

/**
 * Convert object, where keys are css properties, to string.
 *
 * @param {object} _cssObj
 * @return {string}
 */
export function obj2css(_cssObj) {
    let cssStr = '';

    Object.keys(_cssObj).forEach(_prop => {
        cssStr += `${toKebabCase(_prop)}:${_cssObj[_prop]};`;
    });

    return cssStr;
}

/**
 * Uppercase first char of string `_string`.
 *
 * @param {string} _str
 * @return {string}
 */
export function uppercaseFirstChar(_str) {
    if (_str && typeof _str === 'string') {
        return _str.charAt(0).toUpperCase() + _str.slice(1);
    }
    return '';
}

/**
 * Lowercase first char of string `_string`.
 *
 * @param {string} _str
 * @return {string}
 */
export function lowercaseFirstChar(_str) {
    if (_str && typeof _str === 'string') {
        return _str.charAt(0).toLowerCase() + _str.slice(1);
    }
    return '';
}

/**
 * @param {string} _str
 * @return {string}
 */
export function toCamelCase(_str) {
    let spl;

    if (_str && typeof _str === 'string') {
        spl = _str.split(camelSplitRE);

        if (spl.length > 1) {
            spl = spl.filter(_val => _val !== '');

            spl[0] = lowercaseFirstChar(spl[0]);

            for (let i = 1, len1 = spl.length; i < len1; i += 1) {
                spl[i] = uppercaseFirstChar(spl[i]);
            }
        }

        return spl.join('');
    }
    return '';
}

/**
 * @param {string} _str
 * @return {string}
 */
export function toKebabCase(_str) {
    let spl_;
    const spl = [];

    if (_str && typeof _str === 'string') {
        spl_ = _str.split(kebabSplitRE);

        if (spl_.length > 1) {
            spl_ = spl_.filter(_val => !camelSplitRE.test(_val));

            for (let i = 0, len1 = spl_.length; i < len1; i += 1) {
                if (i < len1 - 1 && uppercaseCharsRE.test(spl_[i])) {
                    spl.push(lowercaseFirstChar(spl_[i]) + spl_[i + 1]);
                    i += 1;
                } else if (spl_[i]) {
                    spl.push(lowercaseFirstChar(spl_[i]));
                }
            }
        } else {
            return _str;
        }

        return spl.join('-');
    }
    return '';
}

/**
 * Retuns index of the first founded item `_i` in array `_a`,
 * otherwise returns `-1`. No type checking.
 *
 * @param {*} _i
 * @param {array} _a
 * @param {boolean} [_deep]
 * @return {int}
 */
export function inArray(_i, _a, _deep) {
    let i = 0;
    let len = 0;
    let idx = -1;

    if (isArray(_a)) {
        len = _a.length;
        /* if (_a.indexOf) {
            idx = _a.indexOf(_i);
        } else { */
        for (i = 0; i < len; i += 1) {
            if (_deep) {
                // eslint-disable-next-line eqeqeq
                if (_i == _a[i]) {
                    idx = i;
                    break;
                }
                // eslint-disable-next-line eqeqeq
            } else if (_i == _a[i]) {
                idx = i;
                break;
            }
        }
    }

    return idx;
}
