import './defi.types.js';
import gql from 'graphql-tag';
import {cloneObject, isObjectEmpty, lowercaseFirstChar} from '../../utils';
import web3utils from 'web3-utils';
import { fFetch } from '../ffetch.js';

/** @type {BNBridgeExchange} */
export let defi = null;

// TMP!!
const filterTokens = [];

/**
 * Plugin for various DeFi requests and calculations.
 */
export class DeFi {
    /**
     * @param {Vue} _Vue
     * @param {{apolloClient: ApolloClient}} _options
     */
    static install(_Vue, _options) {
        if (!defi) {
            defi = new DeFi(_options);
            _Vue.prototype.$defi = defi;
        }
    }

    /**
     * @param {{apolloClient: ApolloClient}} _options
     */
    constructor(_options) {
        this.apolloClient = _options.apolloClient;
        /** Liquidation collateral ratio. */
        this.liqCollateralRatio = 1.5;
        /** Minimal collateral ratio. */
        this.minCollateralRatio = 3;
        /** Warning collateral ratio. */
        this.warningCollateralRatio = 2.25; // (this.liqCollateralRatio + this.minCollateralRatio) / 2;
        this.rewardCollateralRatio = 5;
        this.mintFee = 0.0025;
        /** DeFi settings was loaded. */
        this.settingsLoaded = false;
        /** @type {DefiToken[]} */
        this.tokens = [];
        /** @type {DefiToken} */
        this.fusdToken = {};
        /** @type {DefiToken} */
        this.ftmToken = {};
        /** Keys are token symbols, values are number of decimals. */
        this.tokenDecimals = {};
        /** Addresses of various contracts. */
        this.contracts = {
            fMint: '',
            fMintReward: '',
            uniswapCoreFactory: '',
            uniswapRouter: '',
        };
    }

    /**
     * Load settings if it's necessary.
     *
     * @return {Promise}
     */
    async init() {
        if (!this.settingsLoaded) {
            this.settingsLoaded = true;
            this.initProperties(await this.fetchSettings());
        }
    }

    /**
     * Set properties.
     *
     * @param {DefiSettings} _settings
     */
    initProperties(_settings) {
        const dec = Math.pow(10, _settings.decimals);
        const { contracts } = this;

        // this.liqCollateralRatio = parseInt(_settings.liqCollateralRatio4, 16) / dec;
        this.minCollateralRatio = parseInt(_settings.minCollateralRatio4, 16) / dec;
        this.rewardCollateralRatio = parseInt(_settings.rewardCollateralRatio4, 16) / dec;
        // this.warningCollateralRatio = parseInt(_settings.warningCollateralRatio4, 16) / dec;
        this.mintFee = parseInt(_settings.mintFee4, 16) / dec;
        contracts.fMint = _settings.fMintContract;
        contracts.fMintReward = _settings.fMintRewardDistribution;
        contracts.uniswapCoreFactory = _settings.uniswapCoreFactory;
        contracts.uniswapRouter = _settings.uniswapRouter;
    }

    /**
     * @param {DefiToken[]} _tokens
     * @private
     */
    _setTokens(_tokens) {
        this.tokens = _tokens;
        this.fusdToken = _tokens.find((_item) => _item.symbol === 'FUSD');
        this.ftmToken = _tokens.find((_item) => _item.symbol === 'FTM');

        if (isObjectEmpty(this.tokenDecimals)) {
            this.tokens.forEach((_token) => {
                this._setTokenDecimals(_token);
            });
        }
    }

    /**
     * @param {DefiToken} _token
     * @private
     */
    _setTokenDecimals(_token) {
        const tokenPrice = this.getTokenPrice(_token);
        let decimals = 0;

        if (tokenPrice < 0.5) {
            decimals = 1;
        } else if (tokenPrice < 100) {
            decimals = 2;
        } else if (tokenPrice < 1000) {
            decimals = 5;
        } else {
            decimals = 6;
        }

        this.tokenDecimals[_token.symbol] = decimals;
    }

    /**
     * @param {DefiToken} _token
     * @return {number}
     */
    getTokenDecimals(_token) {
        return this.tokenDecimals[_token.symbol] || 2;
    }

    /**
     * @param {number} _collateral
     * @param {number} _tokenPrice
     * @return {number}
     */
    getMaxDebt(_collateral, _tokenPrice) {
        let max = 0;

        if (_collateral > 0) {
            max = (_collateral * _tokenPrice) / this.minCollateralRatio;
        }

        return max;
    }

    getMaxDebtFUSD(_collateralFUSD) {
        return _collateralFUSD > 0 ? _collateralFUSD / this.minCollateralRatio : 0;
    }

    /**
     * @param {number} _debt
     * @param {number} _collateral
     * @return {number}
     */
    getLiquidationPrice(_debt, _collateral) {
        let liqPrice = 0;

        if (_debt > 0 && _collateral > 0) {
            liqPrice = (_debt * this.liqCollateralRatio) / _collateral;
        }

        return liqPrice;
    }

    getMintingLimit(_debt, _collateral, _tokenPrice) {
        // ratio between actual debt and liquidation debt
        return _collateral > 0
            ? (_debt / ((parseFloat(_collateral) * _tokenPrice) / this.liqCollateralRatio)) * 100
            : 0;
    }

    getMintingLimitFUSD(_debt, _collateralFUSD) {
        // ratio between actual debt and liquidation debt
        return _collateralFUSD > 0 ? (_debt / (_collateralFUSD / this.liqCollateralRatio)) * 100 : 0;
    }

    /**
     * Get color values for f-circle-progress and f-colored-number-range components
     *
     * @return {{color: string, value: number}[]}
     */
    getColors() {
        return [
            {
                value: (this.liqCollateralRatio / this.minCollateralRatio) * 100,
                color: '#ffaf19',
            },
            {
                value: (this.warningCollateralRatio / this.minCollateralRatio) * 100,
                color: '#ff1716',
            },
        ];
    }

    /**
     * @param {number} _debt
     * @param {number} _tokenPrice
     * @return {number}
     */
    getMinCollateral(_debt, _tokenPrice) {
        return (_debt * this.minCollateralRatio) / _tokenPrice;
    }

    /**
     * @param {DefiToken} _token
     * @return {string}
     */
    getTokenSymbol(_token) {
        return _token && _token.symbol
            ? _token.symbol !== 'FTM'
                ? lowercaseFirstChar(_token.symbol)
                : _token.symbol
            : '';
    }

    /**
     * @param {DefiToken} _token
     * @return {number}
     */
    getTokenPrice(_token) {
        return _token && 'price' in _token ? this.fromTokenValue(_token.price, _token, true) : 0;
    }

    /**
     * Get overall debt in FUSD.
     *
     * @param {FMintAccount} _fMintAccount
     * @return {number}
     */
    getOverallDebt(_fMintAccount) {
        return this.fromTokenValue(_fMintAccount.debtValue, this.fusdToken);
    }

    /**
     * Get overall collateral in FUSD.
     *
     * @param {FMintAccount} _fMintAccount
     * @return {number}
     */
    getOverallCollateral(_fMintAccount) {
        return this.fromTokenValue(_fMintAccount.collateralValue, this.fusdToken);
    }

    /**
     * Get overall borrow limit in FUSD.
     *
     * @param {FMintAccount} _fMintAccount
     * @return {number}
     */
    getBorrowLimit(_fMintAccount) {
        const overallDebt = this.getOverallDebt(_fMintAccount);
        const overallCollateral = this.getOverallCollateral(_fMintAccount);

        return this.getMaxDebtFUSD(overallCollateral) - overallDebt;
    }

    /**
     * Get overall borrow limit in hex.
     *
     * @param {FMintAccount} _fMintAccount
     * @return {number}
     */
    getBorrowLimitHex(_fMintAccount) {
        const debtValue = web3utils.toBN(_fMintAccount.debtValue);
        const collateralValue = web3utils.toBN(_fMintAccount.collateralValue);

        return '0x' + collateralValue.divn(this.minCollateralRatio).sub(debtValue).toString('hex');
    }

    /**
     * Get overall debt limit in FUSD.
     *
     * @param {FMintAccount} _fMintAccount
     * @param {number} [_currDebtFUSD] Current debt in FUSD.
     * @param {number} [_currCollateralFUSD] Current corrateral in FUSD.
     * @return {number}
     */
    getDebtLimit(_fMintAccount, _currDebtFUSD = 0, _currCollateralFUSD = 0) {
        const overallDebt = this.getOverallDebt(_fMintAccount);
        const overallCollateral = this.getOverallCollateral(_fMintAccount);

        return this.getMintingLimitFUSD(_currDebtFUSD + overallDebt, _currCollateralFUSD + overallCollateral);
    }

    /**
     * Convert given value from token decimals space.
     *
     * @param {string} _value Hex value.
     * @param {DefiToken} _token
     * @param {boolean} [_isPrice]
     */
    fromTokenValue(_value, _token, _isPrice = false) {
        let value = 0;

        if (_value !== undefined && !isNaN(_value)) {
            value = parseFloat(this.shiftDecPointLeft(_value, _isPrice ? _token.priceDecimals : _token.decimals));
        }

        return value;
    }

    /**
     * Convert given value to token decimals space.
     *
     * @param {string} _value
     * @param {DefiToken} _token
     * @param {boolean} [_isPrice]
     * @return {string}
     */
    toTokenValue(_value, _token, _isPrice = false) {
        let value = 0;

        if (_value !== undefined && !isNaN(_value)) {
            value = this.shiftDecPointRight(_value.toString(), _isPrice ? _token.priceDecimals : _token.decimals);
        }

        return value;
    }

    /**
     * @param {string} _value
     * @param {number} _dec Number of decimals.
     * @return {string}
     */
    shiftDecPointLeft(_value, _dec = 0) {
        // const value = web3utils.toBN(_value).toString(10);
        const value = web3utils.toBN(this.removeSN(_value, _dec)).toString(10);
        const idx = value.length - _dec;

        if (idx < 0) {
            return `0.${web3utils.padLeft(value, _dec, '0')}`;
        } else {
            return value.slice(0, idx) + '.' + value.slice(idx);
        }
    }

    /**
     * @param {string} _value
     * @param {number} _dec Number of decimals.
     * @param {boolean} [_float] Don't remove decimals.
     * @return {string}
     */
    shiftDecPointRight(_value, _dec = 0, _float = false) {
        const value = this.removeSN(_value.toString(), _dec);
        let idx = value.indexOf('.');
        let left;
        let right;
        let res = '';
        const isHex = value.indexOf('0x') === 0;

        if (idx > -1) {
            left = value.slice(0, idx);
            right = value.slice(idx + 1);

            if (_dec < right.length) {
                res = left + right.slice(0, _dec) + '.' + right.slice(_dec);
            } else if (_dec === right.length) {
                res = left + right;
            } else {
                res = left + web3utils.padRight(right, _dec, '0');
            }
        } else {
            res = value + web3utils.padRight('', _dec, '0');
        }

        // remove leading zeros
        while (res.length > 0 && res.charAt(0) === '0') {
            res = res.slice(1);
        }

        if (!_float) {
            idx = res.indexOf('.');
            if (idx > -1) {
                res = res.slice(0, idx);
            }

            if (!res) {
                res = '0';
            }
        }

        if (isHex && res.charAt(0) === 'x') {
            res = '0' + res;
        }

        return res;
    }

    /**
     * @param {string} _value
     * @param {number} _decimals
     * @return {string}
     */
    shiftDecPoint(_value, _decimals) {
        const value = _value.toString();

        if (_decimals === 0) {
            return value;
        } else if (_decimals < 0) {
            return this.shiftDecPointLeft(value, -_decimals);
        } else {
            return this.shiftDecPointRight(value, _decimals);
        }
    }

    /**
     * Remove scientific notation.
     *
     * @param {string|number} _value
     * @param {number} _dec
     * @return {string|*}
     */
    removeSN(_value, _dec) {
        const value = typeof _value !== 'string' ? _value.toString() : _value;

        if (value.indexOf('0x') === -1 && (value.indexOf('e') > -1 || value.indexOf('E') > -1)) {
            return parseFloat(value).toFixed(_dec);
        }

        return _value;
    }

    /**
     * Value and result value are both in "WEI".
     *
     * @param {string|number} _value Value in `_token` decimal space.
     * @param {DefiToken} _token
     * @param {DefiToken} _toToken
     * @return {string}
     */
    convertTokenValueWEI(_value, _token, _toToken) {
        if (isObjectEmpty(_token) || isObjectEmpty(_toToken)) {
            return '';
        }

        const value = web3utils.toBN(_value);
        const tokenPrice = web3utils.toBN(_token.price);
        const toTokenPrice = web3utils.toBN(_toToken.price);
        const result = value.mul(tokenPrice).div(toTokenPrice).toString(10);
        const resultDecimals = _toToken.decimals - (_token.decimals + _token.priceDecimals - _toToken.priceDecimals);

        return this.shiftDecPoint(result, resultDecimals);
    }

    /**
     * Value and result value are converted from "WEI".
     *
     * @param {string|number} _value Value in `_token` decimal space.
     * @param {DefiToken} _token
     * @param {DefiToken} _toToken
     * @return {string}
     */
    convertTokenValue(_value, _token, _toToken) {
        return this.fromTokenValue(
            this.convertTokenValueWEI(this.toTokenValue(_value, _token), _token, _toToken),
            _toToken
        );
    }

    /**
     * Compare big numbers, hex.
     *
     * @param {string} _a
     * @param {string} _b
     * @return {-1 | 0 | 1} -1 (_a < _b), 0 (_a == _b), or 1 (_a > _b)
     */
    compareBN(_a, _b) {
        const hex1 = web3utils.toBN(_a);
        const hex2 = web3utils.toBN(_b);

        return hex1.cmp(hex2);
    }

    /**
     * Get defi account debt by token.
     *
     * @param {FMintAccount} _account
     * @param {DefiToken} _token
     * @return {FMintTokenBalance|{}}
     */
    getFMintAccountDebt(_account, _token) {
        let debt = {};
        let acountDebt;

        if (_token && _account && _account.debt && _account.debt.length > 0) {
            acountDebt = _account.debt.find((_item) => _item.tokenAddress === _token.address);
            if (acountDebt) {
                debt = acountDebt;
            }
        }

        return debt;
    }

    /**
     * Get defi account collateral by token.
     *
     * @param {FMintAccount} _account
     * @param {DefiToken} _token
     * @return {FMintTokenBalance|{}}
     */
    getFMintAccountCollateral(_account, _token) {
        let collateral = {};
        let acountCollateral;

        if (_token && _account && _account.collateral && _account.collateral.length > 0) {
            acountCollateral = _account.collateral.find((_item) => _item.tokenAddress === _token.address);
            if (acountCollateral) {
                collateral = acountCollateral;
            }
        }

        return collateral;
    }

    /**
     * @param {DefiToken} _token
     * @return {boolean}
     */
    canTokenBeMinted(_token) {
        // return _token && _token.isActive && _token.canMint && _token.symbol !== 'FUSD';
        return _token && _token.isActive && _token.canMint;
    }

    /**
     * @param {DefiToken} _token
     * @return {boolean}
     */
    canTokenBeBorrowed(_token) {
        // return _token && _token.isActive && _token.canBorrow && _token.symbol !== 'FUSD';
        return _token && _token.isActive && _token.canBorrow;
    }

    /**
     * @param {DefiToken} _token
     * @return {boolean}
     */
    canTokenBeDeposited(_token) {
        return _token && _token.isActive && _token.canDeposit && _token.symbol !== 'FTM';
    }

    /**
     * @param {DefiToken} _token
     * @return {boolean}
     */
    canTokenBeTraded(_token) {
        // return _token && _token.isActive && _token.canTrade;
        return _token && _token.isActive && (_token.canTrade || _token.symbol === 'FTM');
        // return _token && _token.isActive && (_token.canTrade || _token.symbol === 'FUSD');
    }

    /**
     * @param {DefiToken} _token
     * @return {boolean}
     */
    filterTokensBySymbol(_token) {
        return _token && filterTokens.indexOf(_token.symbol) > -1;
    }

    /**
     * @return {Promise<DefiSettings>}
     */
    async fetchSettings() {
        const data = await this.apolloClient.query({
            query: gql`
                query DefiSettings {
                    defiConfiguration {
                        mintFee4
                        rewardCollateralRatio4
                        minCollateralRatio4
                        fMintContract
                        decimals
                    }
                }
            `,
            fetchPolicy: 'network-only',
        });

        return data.data.defiConfiguration || {};
    }

    /**
     * @param {string} _ownerAddress
     * @param {string|array} [_symbol]
     * @return {Promise<DefiToken[]>}
     */
    async fetchTokens(_ownerAddress, _symbol) {
        const query = {
            query: _ownerAddress
                ? gql`
                      query DefiTokens($owner: Address!) {
                          defiTokens {
                              address
                              name
                              symbol
                              logoUrl
                              decimals
                              price
                              priceDecimals
                              totalSupply
                              isActive
                              canWrapFTM
                              canDeposit
                              canMint
                              canBorrow
                              canTrade
                              availableBalance(owner: $owner)
                              allowance(owner: $owner)
                          }
                      }
                  `
                : gql`
                      query DefiTokens {
                          defiTokens {
                              address
                              name
                              symbol
                              logoUrl
                              decimals
                              price
                              priceDecimals
                              totalSupply
                              isActive
                              canWrapFTM
                              canDeposit
                              canMint
                              canBorrow
                              canTrade
                          }
                      }
                  `,
            variables: {
                owner: _ownerAddress,
            },
            // fetchPolicy: 'network-only',
        };
        // const data = await this.apolloClient.query(query);
        const data = await fFetch.fetchGQLQuery(query, 'defiTokens');

        let defiTokens = data.data.defiTokens || [];

        if (filterTokens.length > 0) {
            defiTokens = defiTokens.filter(this.filterTokensBySymbol);
        }
        // console.log(defiTokens);

        let tokens = [];

        this._setTokens(defiTokens);

        if (_symbol) {
            if (typeof _symbol === 'string') {
                tokens = defiTokens.find((_item) => _item.symbol === _symbol);
            } else if (_symbol.length) {
                tokens = defiTokens.filter((_item) => _symbol.indexOf(_item.symbol) > -1);
            }
        } else {
            tokens = defiTokens;
        }

        return tokens;
    }

    /**
     * @param {string} _ownerAddress
     * @param {string|array} [_symbol]
     * @return {Promise<DefiToken[]>}
     */
    async fetchERC20Tokens(_ownerAddress, _symbol) {
        const query = {
            query: _ownerAddress
                ? gql`
                      query ERC20TokenList($owner: Address!) {
                          erc20TokenList {
                              address
                              name
                              symbol
                              decimals
                              totalSupply
                              balanceOf(owner: $owner)
                          }
                      }
                  `
                : gql`
                      query ERC20TokenList {
                          erc20TokenList {
                              address
                              name
                              symbol
                              decimals
                              totalSupply
                          }
                      }
                  `,
            variables: {
                owner: _ownerAddress,
            },
            // fetchPolicy: 'network-only',
        };
        // const data = await this.apolloClient.query(query);
        const data = await fFetch.fetchGQLQuery(query, 'erc20TokenList');

        let erc20TokenList = data.data.erc20TokenList || [];

        if (filterTokens.length > 0) {
            erc20TokenList = erc20TokenList.filter(this.filterTokensBySymbol);
        }
        // console.log('erc20', erc20TokenList);

        let tokens = [];

        this._setTokens(erc20TokenList);

        if (_symbol) {
            if (typeof _symbol === 'string') {
                tokens = erc20TokenList.find((_item) => _item.symbol === _symbol);
            } else if (_symbol.length) {
                tokens = erc20TokenList.filter((_item) => _symbol.indexOf(_item.symbol) > -1);
            }
        } else {
            tokens = erc20TokenList;
        }

        return tokens;
    }

    /**
     * @param {string} _ownerAddress
     * @return {Promise<DefiToken[]>}
     */
    async fetchERC20TokensAvailableBalances(_ownerAddress) {
        const query = {
            query: gql`
                query ERC20TokenList($owner: Address!) {
                    erc20TokenList {
                        address
                        balanceOf(owner: $owner)
                    }
                }
            `,
            variables: {
                owner: _ownerAddress,
            },
        };
        const data = await fFetch.fetchGQLQuery(query, 'erc20TokenList');

        return data.data.erc20TokenList || [];
    }

    /**
     * @param {string} _ownerAddress
     * @param {ERC20Token[]} _tokens
     */
    async getERC20TokensWithAvailableBalances(_ownerAddress, _tokens) {
        const tokenBalances = await this.fetchERC20TokensAvailableBalances(_ownerAddress);
        const tokens = cloneObject(_tokens);

        if (tokenBalances) {
            tokenBalances.forEach((_token) => {
                const token = tokens.find((_t) => _t.address === _token.address);

                if (token) {
                    token.balanceOf = _token.balanceOf;
                }
            });
        }

        return tokens;
    }

    /**
     * @param {string|array} [_symbol]
     * @return {Promise<number[]>}
     */
    async fetchTokenPrices(_symbol) {
        const data = await this.apolloClient.query({
            query: gql`
                query DefiTokens {
                    defiTokens {
                        address
                        symbol
                        decimals
                        price
                        priceDecimals
                        isActive
                    }
                }
            `,
            fetchPolicy: 'network-only',
        });
        let defiTokens = data.data.defiTokens || [];
        let tokens = [];

        this._setTokens(defiTokens);

        if (_symbol) {
            if (typeof _symbol === 'string') {
                tokens = defiTokens.find((_item) => _item.symbol === _symbol);
            } else if (_symbol.length) {
                tokens = defiTokens.filter((_item) => _symbol.indexOf(_item.symbol) > -1);
            }
        } else {
            tokens = defiTokens;
        }

        return tokens.map((_token) => this.fromTokenValue(_token.price, _token, true));
    }

    /**
     * @param {string} _ownerAddress
     * @return {Promise<FMintAccount>}
     */
    async fetchFMintAccount(_ownerAddress = '') {
        const data = await this.apolloClient.query({
            query: gql`
                query FMintAccount($owner: Address!) {
                    fMintAccount(owner: $owner) {
                        address
                        collateral {
                            type
                            tokenAddress
                            balance
                            value
                            token {
                                address
                                symbol
                            }
                        }
                        collateralValue
                        collateralList
                        debt {
                            type
                            tokenAddress
                            balance
                            value
                            token {
                                address
                                symbol
                            }
                        }
                        debtValue
                        debtList
                    }
                }
            `,
            variables: {
                owner: _ownerAddress,
            },
            fetchPolicy: 'network-only',
        });
        /** @type {FMintAccount} */
        const { fMintAccount } = data.data;

        return fMintAccount;
    }

    /**
     * @param {string} [_to]
     * @return {Promise<Number>}
     */
    async fetchFTMTokenPrice(_to = 'USD') {
        const data = await this.apolloClient.query({
            query: gql`
                query Price($to: String!) {
                    price(to: $to) {
                        price
                    }
                }
            `,
            variables: {
                to: _to,
            },
            fetchPolicy: 'network-only',
        });

        if (!data.data.price) {
            return;
        }

        let tokenPrice = parseFloat(data.data.price.price);

        tokenPrice = parseInt(tokenPrice * 100000) / 100000;

        return tokenPrice;
    }
}
