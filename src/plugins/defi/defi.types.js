/**
 * DeFi settings object.
 * @typedef {Object} DefiSettings
 * @property {number} mintFee4 Current fee applied to all minting operations on fMint protocol.
 * @property {number} rewardCollateralRatio4 Minimal ratio between collateral and debt values in ref. denomination (fUSD) on which the account is eligible for rewards distribution.
 * @property {number} minCollateralRatio4 Minimal collateral ratio.
 * @property {string} fMintContract Address of the fMint contract.
 * @property {string} fMintRewardDistribution Address of the DeFi fMint reward distribution contract.
 * @property {string} uniswapCoreFactory Address of the Uniswap Core Factory contract.
 * @property {string} uniswapRouter Address of the Uniswap Router contract.
 * @property {string} StakeTokenizerContract Address of the Stake Tokenizer contract.
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
 * @property {boolean} canWrapFTM Signals if the token can be used to wrap native FTM tokens for DeFi trading.
 * @property {boolean} canDeposit Signals if the token can be used in deposit as a collateral asset.
 * @property {boolean} canMint Signals if the token can be used in fMint protocol as the target token.
 * @property {boolean} canBorrow Signals if the token is available for FLend borrow operations.
 * @property {boolean} canTrade Signals if the token is available for FTrade direct trading operations.
 */

/**
 * DeFi token balance object.
 * @typedef {Object} FMintTokenBalance
 * @property {string} tokenAddress Unique identifier of the token.
 * @property {DefiToken} token
 * @property {string} balance Balance of the token on the account.
 * @property {string} value Value of the current balance of the token on the account in ref. denomination (fUSD).
 */

/**
 * DeFi account object.
 * @typedef {Object} FMintAccount
 * @property {string} address Address of the DeFi account.
 * @property {FMintTokenBalance[]} collateral List of all collateral assets.
 * @property {string} collateralValue Current collateral value in ref. denomination (fUSD).
 * @property {string[]} collateralList List of all collateral tokens linked with the account.
 * @property {FMintTokenBalance[]} debt List of all the current borrowed tokens.
 * @property {string} debtValue Current debt value in ref. denomination (fUSD).
 * @property {string[]} debtList List of all debt tokens linked with the account.
 * @property {string} rewardsEarned Accumulated rewards earned on the DeFi / fMint account for the excessive collateral value.
 * @property {string} rewardsStashed Accumulated rewards earned on the DeFi / fMint account for the excessive collateral value and stored into the stash for future claim.
 * @property {boolean} canClaimRewards Informs if the fMint account collateral to debt is high enough to allow earned rewards claiming.
 * @property {boolean} canPushNewRewards Indicates if new rewards are unlocked inside the reward distribution and can be pushed into the system to distribute them among eligible accounts.
 * @property {boolean} canReceiveRewards informs if the fMint account collateral to debt is high enough to receive earned rewards.
 */
