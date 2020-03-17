import web3utils from 'web3-utils';

const WEI_IN_FTM = 1000000000000000000;

/**
 * @return {number}
 */
export function WEIToFTM(_value) {
    return (_value / WEI_IN_FTM);
}

/**
 * @return {number}
 */
export function FTMToWEI(_value) {
    return _value * WEI_IN_FTM;
}

/**
 * @param {*} _value
 * @param {number} [_tokenPrice]
 * @return {number}
 */
export function FTMToUSD(_value, _tokenPrice = 0.002) {
    return _value * _tokenPrice;
}

/**
 * Check if given string is transaction hash, address or block number.
 *
 * @return {'transaction_hash' | 'address' | 'block' | ''}
 */
export function getTypeByStr(_str) {
    let type = '';
    let num = 0;

    if (_str) {
        if (web3utils.isHexStrict(_str)) {
            if (_str.length === 66) {
                type = 'transaction_hash';
            // } else if (web3utils.toChecksumAddress(_str)) {
            } else if (web3utils.isAddress(_str)) {
                type = 'address';
            }
        } else {
            num = parseInt(_str);
            if (!isNaN(num)) {
                type = 'block';
            }
        }
    }

    return type;
}
