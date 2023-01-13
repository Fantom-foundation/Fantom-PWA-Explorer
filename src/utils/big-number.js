import { BigNumber } from 'bignumber.js';

export const BigNumber0 = BigNumber.clone({
    DECIMAL_PLACES: 0,
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

/**
 * @param {string|number|BigNumber} _value
 * @return {BigNumber}
 */
export function toBigNumber(_value) {
    return new BigNumber0(_value);
}

/**
 * Shift decimal point
 *
 * @param {string|number|BigNumber} _value
 * @param {number} [_dp]
 * @return {BigNumber}
 */
export function bShiftDP(_value, _dp = 18) {
    return toBigNumber(_value).shiftedBy(_dp);
}

/**
 * @param {string|number|BigNumber} value
 * @param {number} [decimals]
 * @return {BigNumber}
 */
export function bFromTokenValue(value, decimals = 18) {
    return bShiftDP(value, -decimals);
}

/**
 * @param {string|number|BigNumber} value
 * @param {number} [decimals]
 * @return {BigNumber}
 */
export function bToTokenValue(value, decimals = 18) {
    return bShiftDP(value, decimals);
}

/**
 * From Wei to Ether
 *
 * @param {string|number|BigNumber} value
 * @return {BigNumber}
 */
export function bFromWei(value) {
    return bFromTokenValue(value);
}

/**
 * From Ether to Wei
 *
 * @param {string|number|BigNumber} value
 * @return {BigNumber}
 */
export function bToWei(value) {
    return bToTokenValue(value);
}

/**
 * @param {string|number|BigNumber} _value
 * @return {string}
 */
export function toHex(_value) {
    // return web3utils.toHex(_value);
    return `0x${toBigNumber(_value).toString(16)}`;
}

/**
 * @param {string|number|BigNumber} _value
 * @return {number}
 */
export function toInt(_value) {
    return parseInt(toBigNumber(_value).toString(10));
}
