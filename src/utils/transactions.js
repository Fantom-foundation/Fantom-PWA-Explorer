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