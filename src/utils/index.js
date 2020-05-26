import shortid from 'shortid';

const uppercaseCharsRE = /([A-Z])/;
const camelSplitRE = /[ _-]+/;
const kebabSplitRE = /([A-Z]|[ _-]+)/;

/**
 * @return {string}
 */
export function getUniqueId() {
    return `i${shortid.generate()}`;
}

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
    return isArray(_ar) && _i >= 0 && _i < _ar.length;
}

/**
 * Convert object, where keys are css properties, to string.
 *
 * @param {object} _cssObj
 * @return {string}
 */
export function obj2css(_cssObj) {
    let cssStr = '';

    Object.keys(_cssObj).forEach((_prop) => {
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
            spl = spl.filter((_val) => _val !== '');

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
            spl_ = spl_.filter((_val) => !camelSplitRE.test(_val));

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

/**
 * Call function asynchronously.
 *
 * @param {function} _callback
 * @param {int} [_timeout]
 */
export function defer(_callback, _timeout = 0) {
    // setTimeout(_callback, _timeout);

    // setTimeout(_callback, _timeout || 0);

    if (_timeout > 0) {
        setTimeout(_callback, _timeout);
    } else {
        requestAnimationFrame(_callback);
    }
    // return new Promise(_resolve => setTimeout(() => {_func(); _resolve();}, _timeout || 0));
}

/**
 *
 * @param {Function} _callback
 * @param {int} _wait
 * @param {object} _options
 * @return {Function}
 */
export function debounce(_callback, _wait = 250, _options) {
    let timeoutId = -1;
    let leading = false;
    let trailing = true;
    let wait = 0;
    let maxWait = 0;
    let lastCallTime = 0;
    let callTime = 0;

    if (typeof _options === 'object') {
        if ('maxWait' in _options) {
            // eslint-disable-next-line radix
            maxWait = parseInt(_options.maxWait) || 0;
        }
        if ('leading' in _options) {
            leading = !!_options.leading;
        }
        if ('trailing' in _options) {
            trailing = !!_options.trailing;
        }
    }

    if (maxWait > 0) {
        trailing = true;
    }

    return (..._args) => {
        callTime = Date.now();

        if (maxWait > 0) {
            wait = _wait;
            if (callTime - lastCallTime < maxWait) {
                wait = Math.min(lastCallTime + maxWait - callTime, _wait);
            } else {
                lastCallTime = callTime;

                if (timeoutId > -1) {
                    _callback(..._args);
                }
            }
        } else {
            wait = _wait;
        }

        if (timeoutId > -1) {
            clearTimeout(timeoutId);
            timeoutId = -1;
        } else if (leading && (maxWait === 0 || lastCallTime === callTime)) {
            lastCallTime = Date.now();
            _callback(..._args);
        }

        if (timeoutId === -1) {
            timeoutId = setTimeout(() => {
                timeoutId = -1;
                if (trailing) {
                    lastCallTime = Date.now();
                    _callback(..._args);
                }
            }, wait); // (maxWait > 0 ? () : _wait));
        }
    };
}

/**
 * @param {Function} _callback
 * @param {int} _interval
 * @param {boolean} [_leading]
 * @return {Function}
 */
export function throttle(_callback, _interval, _leading) {
    return debounce(_callback, _interval, {
        maxWait: _interval,
        leading: _leading || false,
        trailing: true,
    });
}

/**
 * Get object's nested property value.
 *
 * @param {object} _obj
 * @param {string} _path Property names, separated by `.`
 * @return {*|null}
 */
export function getNestedProp(_obj, _path) {
    const path = _path ? _path.split('.') : [];
    const pathLen = path.length;
    let value = null;

    if (_obj && pathLen > 0) {
        if (pathLen === 1) {
            value = _obj[path[0]];
        } else {
            value = _obj;
            for (let i = 0; i < pathLen; i++) {
                value = value[path[i]];
                if (value === null || value === undefined) {
                    value = null;
                    break;
                }
            }
        }
    }

    return value;
}

/**
 * Deep extend an object.
 *
 * @param {Object} _out
 * @param [_args]
 * @return {*|{}}
 */
export function deepExtend(_out, ..._args) {
    const out = _out || {};
    let obj;

    for (let i = 0, len = _args.length; i < len; i += 1) {
        obj = _args[i];

        if (!isObject(obj)) {
            // eslint-disable-next-line no-continue
            continue;
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (!obj.hasOwnProperty(key)) {
                // || (typeof obj[key] === 'function')) {
                // eslint-disable-next-line no-continue
                continue;
            }

            // console.log("TYPeOF", typeof obj[key]);

            // if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
            if (isObject(obj[key])) {
                out[key] = deepExtend(out[key], obj[key]);
                // eslint-disable-next-line no-continue
                continue;
            }

            out[key] = obj[key];
        }
    }

    return out;
}
