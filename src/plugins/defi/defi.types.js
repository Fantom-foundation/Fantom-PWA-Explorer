/**
 * DeFi settings object.
 * @typedef {Object} DefiSettings
 * @property {number} tradeFee4 Current fee applied to all direct trading operations.
 * @property {number} loanFee4 Current entry fee applied to all lending operations.
 * @property {number} minCollateralRatio4 Minimal collateral ratio.
 * @property {number} warningCollateralRatio4
 * @property {number} liqCollateralRatio4 Liquidation collateral ratio.
 * @property {number} decimals Decimals represents the decimals / digits correction applied to the fees and ratios.
 */

/**
 * DeFi token object.
 * @typedef {Object} DefiToken
 * @property {string} address Address of the token is used as the token's unique identifier.
 * @property {string} name Name of the token.
 * @property {string} symbol Symbol used as an abbreviation for the token.
 * @property {string} logoUrl URL of the token logo image.
 * @property {number} decimals Decimals is the number of decimals the token supports.
 * @property {number} price Value of the token in ref. denomination (fUSD).
 * @property {number} priceDecimals Number of decimals used on the price field.
 * @property {string} allowance Amount of ERC20 tokens unlocked by the owner / token holder to be accessible for DeFi operations
 * @property {string} availableBalance Available balance of the token on the account regardless of the DeFi usage of the token.
 * @property {boolean} isActive Signals if the token can be used in the DeFi functions at all.
 * @property {boolean} canDeposit Signals if the token can be used in deposit as a collateral asset.
 * @property {boolean} canBorrow Signals if the token is available for FLend borrow operations.
 * @property {boolean} canTrade Signals if the token is available for FTrade direct trading operations.
 */

/**
 * DeFi token balance object.
 * @typedef {Object} DefiTokenBalance
 * @property {string} tokenAddress Unique identifier of the token.
 * @property {DefiToken} token
 * @property {string} balance Balance of the token on the account.
 * @property {string} value Value of the current balance of the token on the account in ref. denomination (fUSD).
 */

/**
 * DeFi account object.
 * @typedef {Object} DefiAccount
 * @property {string} address Address of the DeFi account.
 * @property {DefiTokenBalance[]} collateral List of all collateral assets.
 * @property {string} collateralValue Current collateral value in ref. denomination (fUSD).
 * @property {string[]} collateralList List of all collateral tokens linked with the account.
 * @property {DefiTokenBalance[]} debt List of all the current borrowed tokens.
 * @property {string} debtValue Current debt value in ref. denomination (fUSD).
 * @property {string[]} debtList List of all debt tokens linked with the account.
 */
