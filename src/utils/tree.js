import { isArray, inArray } from "./index.js";
import shortid from 'shortid';

export class Tree {
    constructor(_data, _options) {
        this._options = {
            // you can't insert or remove tree item
            // readOnly: true,
            // idPrefix: 'i',
            data: null,
            walkType: 'normal',
            pathCode: '_type',
            prepareData: true,
            addId: false,
            _addId: false,
            checkChangesOnUpdate: false,
            // function
            onDataNode: null,
            onDataWrap: null,
            onBeforeNodeRemove: null,
            onBeforeDataNode: null,
            onBeforeDataRemove: null,
        };

        Object.assign(this._options, _options);

        const options = this._options;

        /** Root of the tree. */
        this.root = {
            // id: '_root',
            _c: [], // children
            _p: null, // parent
            _l: -1, // level
        };

        /** Keys are ids (row.id or row[0]), values are references to `this.root` array items. */
        this.dataL = {};
        /** Pointer to actual node. */
        this._cursor = this.root;
        /** Options for remove walking. */
        this.removeWalkOptions = {
            walkType: 'render',
            onDataNode: _node => {
                let id = '';

                if (options.onBeforeNodeRemove) {
                    options.onBeforeNodeRemove(_node);
                }

                if (options.prepareData) {
                    if (options.onBeforeDataRemove) {
                        options.onBeforeDataRemove(_node);
                    }

                    id = this.getNodeId(_node);
                    if (id) {
                        delete this.dataL[id];
                    }
                }

                if (_node._c) {
                    _node._c = null;
                }

                return '';
            },
            onDataWrap() {},
            onBeforeDataNode: options.onBeforeDataNodeRemove || null,
        };

        if (options.addId) {
            options._addId = true;
        }

        this.setData(_data || []);
    }

    _destructor() {
        this.remove(this.root);
    }

    /**
     * Set new data.
     *
     * @param {array} _data Tree data.
     * @return {void}
     */
    setData(_data) {
        if (isArray(_data)) {
            if (this.root._c.length > 0) {
                this.clear(true);
            }

            this.root._c = _data;

            if (this._options.prepareData) {
                this.prepare();
            }
        }
    }

    /**
     * Walk data and add level and parent informations to node and create `this.dataL` object.
     *
     * @param {object} [_node] Start preparing data from node `_node`.
     * @return {void}
     */
    prepare(_node) {
        let item = null;
        const options = this._options;
        let node = null;
        const { dataL } = this;

        if (_node) {
            item = _node;

            if (options._addId && item.id === undefined) {
                item.id = this._getId(); // 'dn' + this._cntr++;
                if (dataL[item.id] !== undefined) {
                    do {
                        item.id = this._getId(); // 'dn' + this._cntr++;
                    } while (dataL[item.id] !== undefined);
                }

                dataL[item.id] = _node;
            }
        }

        if (_node) {
            node = _node;
        } else {
            node = this.root;
            if (node.id === undefined && options._addId) {
                node.id = '_root';
                dataL[node.id] = node;
            }
        }

        this._prepare(node);
    }

    /**
     * Get unique id.
     *
     * @return {string}
     * @private
     */
    _getId() {
        return shortid.generate();
    }

    /**
     * Walk data and add level and parent informations to node
     * and create `this.dataL` object.
     *
     * @param {object} _node
     * @param {int} [_level]
     * @return {void}
     * @api private
     */
    _prepare(_node, _level) {
        const children = _node && _node._c ? _node._c : [];
        const options = this._options;
        const addId = options._addId;
        const { preserveId } = options;
        let node = null;
        let item = null;
        const level = _level === undefined && _node ? _node._l + 1 : _level;
        let id;
        // readOnly = this._options.readOnly,
        // onDataNode = this.onDataNode,

        for (let i = 0, len = children.length; i < len; i++) {
            node = children[i];

            if (!node) {
                // IE8 bitch
                continue;
            }

            item = node;

            if (addId) {
                if (!(preserveId && item.id)) {
                    item.id = this._getId(); // 'dn' + this._cntr++;
                } /* else {
                    this._cntr++;
                } */
            }

            node._p = _node;
            node._l = level;

            id = item.id;

            this.dataL[id] = node;

            if (node._c) {
                this._prepare(node);
            }
        }
    }

    /**
     * Prepare just one node.
     *
     * @param {object} _node
     * @param {object} _parent P`arent` node.
     * @return {void}
     */
    prepareNode(_node, _parent) {
        let id;

        _node._p = _parent;
        _node._l = _parent._l + 1;

        id = this.getNodeId(_node);
        if (id) {
            this.dataL[id] = _node;
        }
    }

    /**
     * Check to see, if tree is empty.
     *
     * @return {boolean}
     */
    isEmpty() {
        const c = this.root._c;

        return !(c && c.length > 0);
    }

    /**
     * Walk tree.
     *
     * @param {object} [_node]
     * @param {object} [_args]
     * @param {object} [_args2]
     * @return {String|Boolean}
     */
    walk(_node, _args, _args2) {
        const options = this._options;
        const args = {
            onDataNode: null, // function
            onDataWrap: null, // function
            onBeforeDataNode: null,
            justChildren: false, // Walk on children only.
            renderStartNode: false,
            noFristWrap: false, // don't render first wrap element
            walkType: '', // 'normal' | 'render'
        };
        let node = null;
        let ret;

        Object.assign(args, _args);

        if (args.onDataNode === null) {
            args.onDataNode = options.onDataNode;
        }

        if (args.onDataWrap === null) {
            args.onDataWrap = options.onDataWrap;
        }

        if (args.walkType === '') {
            args.walkType = options.walkType;
        }

        switch (args.walkType) {
            case 'normal':
                // call `onDataWrap` function on `node`, if it is parent
                if (options.normalWalkParent) {
                    node = _node || this.root;
                    if (node && node._c && node._c.length > 0) {
                        if (args.onDataWrap) {
                            args.onDataWrap(node, _args2);
                        }
                    }
                }

                ret = this._walkNormal(_node || this.root, args, _args2);
                break;
            case 'render':
                if (args.renderStartNode) {
                    _node = { _c: [_node] };
                }

                ret = this._walkRender(
                    _node || this.root,
                    args,
                    args.renderStartNode || args.noFristWrap,
                    _args2,
                );
                break;
            default:
                ret = false;
        }

        args.onDataNode = null;
        args.onDataWrap = null;

        return ret;
    }

    /**
     * Walks tree from node `_node` downwards to the leafs.
     * Walking can be stopped by returning `false` in the walk function.
     *
     * @param {object} _node
     * @param {object} _args
     * @param {object} [_args2]
     * @return {string}
     * @api private
     */
    _walkNormal(_node, _args, _args2) {
        const children = _node && _node._c ? _node._c : [];
        let node = null;
        const onBeforeDataNode = _args.onBeforeDataNode || null;
        const onDataNode = _args.onDataNode || null;
        const onDataWrap = _args.onDataWrap || null;

        for (let i = 0, len = children.length; i < len; i++) {
            node = children[i];

            if (node) {
                if (onBeforeDataNode) {
                    onBeforeDataNode(node, _args2);
                }

                if (node._c && node._c.length > 0 && !_args.justChildren) {
                    if (onDataWrap && !onDataWrap(node, _args2)) {
                        return false;
                    }

                    if (!this._walkNormal(node, _args, _args2)) {
                        return false;
                    }
                } else if (onDataNode && !onDataNode(node, _args2)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Walks tree from leaf upwards and collects outputs on the way.
     *
     * @param {object} _node
     * @param {object} _args
     * @param {boolean} [_noWrap]
     * @param {object} [_args2]
     * @return {string}
     * @api private
     */
    _walkRender(_node, _args, _noWrap, _args2) {
        const children = _node && _node._c ? _node._c : [];
        let node = null;
        let s = '';
        let s2 = '';
        const onBeforeDataNode = _args.onBeforeDataNode || null;
        const onDataNode = _args.onDataNode || null;

        for (let i = 0, len = children.length; i < len; i++) {
            node = children[i];
            s2 = '';

            if (node) {
                if (onBeforeDataNode) {
                    onBeforeDataNode(node, _args2);
                }

                if (node._c && node._c.length > 0 && !_args.justChildren) {
                    s2 = this._walkRender(node, _args, false, _args2);
                }

                if (onDataNode) {
                    /* LOG('UUU: ' + node.id) */
                    s += onDataNode(node, s2, _args2);
                }
            }
        }

        if (_args.onDataWrap && !_noWrap) {
            return _args.onDataWrap(_node, s, _args2);
        }
        return s;
    }

    /**
     * Remove node(s) from tree.
     *
     * @param {object|string} _node Node or path.
     * @param {array} [_interval] Remove nodes in this interval of indices into children array. `_node` is parent in this case.
     * @param {boolean} [_isId]
     * @return {boolean}
     */
    remove(_node, _interval, _isId) {
        let node = this._getNode(_node, _isId);
        let parent = null;
        let idx = -1;
        const options = this._options;
        const dataPrepared = options.prepareData;
        const { onBeforeDataNode } = options;
        let interval = null;
        let id;

        if (!node) {
            return false;
        }

        if (isArray(_interval)) {
            interval = _interval;
        } else {
            idx = this.getNodeIdx(node);
            interval = [idx, idx];
        }

        if (_interval) {
            parent = node;
        } else if (dataPrepared) {
            parent = node._p;
        }

        for (let i = interval[0]; i <= interval[1]; i++) {
            idx = interval[0];

            /* if (parent && !parent._c) {
                alert('WTT!!\n' + this._utils.printObjectSimple(parent, true) + '\n' + this._objectId + '\n\n' + this._utils.printObjectSimple(_node, true) + ' ... ' + _interval);
            } */

            node = parent ? parent._c[idx] : this.root;

            if (dataPrepared) {
                // delete reference from this.dataL object
                id = this.getNodeId(node);
                if (id) {
                    if (options.onBeforeDataNodeRemove) {
                        options.onBeforeDataNodeRemove(node);
                    }

                    // this.dataL[id] = null;
                    delete this.dataL[id];
                }

                // delete reference from parent's children array
                // parent = node._p;
                if (parent) {
                    parent._c[idx] = null;
                    parent._c.splice(idx, 1);

                    if (parent._c.length === 0) {
                        delete parent._c;
                    }
                    /* idx = this.getNodeIdx(node);
                    if (idx > -1) {
                        parent._c[idx] = null;
                        parent._c.splice(idx, 1);
                    } */
                }
            }

            if (onBeforeDataNode) {
                onBeforeDataNode(node);
            }

            // prevent memory leaks - walk all nodes and "null" data
            this.walk(node, this.removeWalkOptions);

            if (node._p === null) {
                // root
                if (dataPrepared && this.dataL._root) {
                    delete this.dataL._root;
                }
                node._c = null;
            }

            node = null;
        }

        return true;
    }

    /**
     * Clear tree.
     *
     * @return {void}
     */
    clear() {
        this.remove(this.root);
        this.root._c = [];
        this._cursor = this.root;
    }

    /**
     * Get node.
     *
     * @param {object|string} _nodeOrPathOrId
     * @param {boolean} [_isId] `_nodeOrPathOrId` is node's id.
     * @return {object|null} Tree node.
     */
    _getNode(_nodeOrPathOrId, _isId) {
        let node = _nodeOrPathOrId;

        if (typeof _nodeOrPathOrId === 'string') {
            if (_isId) {
                node = this.get(_nodeOrPathOrId);
            } else {
                node = this.getNodeByPath(_nodeOrPathOrId);
            }
        }

        return node;
    }

    /**
     * Get node by path.
     *
     * @param {string} _path
     * @param {boolean} [_pathCode]
     * @return {object|null} Tree node.
     */
    getNodeByPath(_path, _pathCode) {
        let path = _path.trim();
        let pathA = null;
        let ar = null;
        let node = null;
        let relativePath = false;
        const pathCode = _pathCode || this._options.pathCode;
        let children = null;
        let idx = 0;
        let found = false;
        let quit = false;

        if (path) {
            if (path === '/') {
                node = this.root;
            } else {
                pathA = path.split('/');
                if (!pathA[0]) {
                    // absolute path
                    pathA.shift();
                    node = this.root;
                } else {
                    // relative path
                    relativePath = true;
                    node = this._cursor;
                }

                for (let i = 0, len = pathA.length; i < len; i++) {
                    path = pathA[i];

                    if (relativePath && path === '..') {
                        if (this._cursor._p !== null) {
                            this._cursor = this._cursor._p;
                            node = this._cursor;
                        }
                    } else {
                        ar = path.split(':');

                        children = node._c;
                        if (children && children.length > 0) {
                            idx = parseInt(ar[0]);
                            if (!isNaN(idx)) {
                                node = children[idx];
                            } else {
                                found = false;

                                for (let j = 0, len2 = children.length; j < len2; j++) {
                                    if (children[j][pathCode] === ar[0]) {
                                        node = children[j];
                                        found = true;
                                        break;
                                    }
                                }

                                if (!found) {
                                    node = null;
                                }
                            }

                            if (node) {
                                if (ar.length === 2 && node[pathCode] !== ar[1]) {
                                    quit = true;
                                }
                            } else {
                                quit = true;
                            }
                        } else {
                            quit = true;
                        }

                        if (quit) {
                            node = null;
                            break;
                        }
                    }
                }
            }
        }

        return node;
    }

    /**
     * Get path (absolute) of node.
     *
     * @param {object} [_node] Data node.
     * @param {boolean} [_withPathCode] Get path with path code (`_type`).
     * @param {string} [_pathCode] Path without index and with _pathCode.
     * @return {string}
     */
    getPath(_node, _withPathCode, _pathCode) {
        const node = _node || this.root;
        const { pathCode } = this._options;
        const aPath = [''];
        let parents = null;
        let path = '';

        if (node === this.root) {
            path = '/';
        } else {
            parents = this.getParents(node);
            if (parents.length > 0) {
                for (let i = parents.length - 1; i >= 0; i--) {
                    if (_pathCode) {
                        aPath.push(parents[i][_pathCode]);
                    } else {
                        aPath.push(
                            this.getNodeIdx(parents[i]) +
                            (_withPathCode ? `:${parents[i][pathCode]}` : ''),
                        );
                    }
                }

                path = aPath.join('/');
            }
        }

        return path;
    }

    /**
     * Set cursor to node defined by path or node.
     *
     * @param {object|string} _nodeOrPath
     * @return {object|null} Cursor or null.
     */
    cd(_nodeOrPath) {
        const node = this._getNode(_nodeOrPath);

        if (node) {
            this._cursor = node;
        }

        return node;
    }

    /**
     * Get array of node's parents (including node itself).
     *
     * @param {*} _idOrNode
     * @param {*} [_endParentNode] Id or node.
     * @param {boolean} [_getObjectIds]
     * @return {array} Array of nodes.
     */
    getParents(_idOrNode, _endParentNode, _getObjectIds) {
        let node = this._getNode(_idOrNode, true);
        const endParentNode = _endParentNode ? this._getNode(_endParentNode, true) : null;
        const parents = [];

        if (node) {
            parents.push(_getObjectIds ? node._componentId : node);
            node = node._p;
            while (node && node._p !== endParentNode) {
                parents.push(_getObjectIds ? node._componentId : node);
                node = node._p;
            }
        }

        return parents;
    }

    /**
     * Get array of node's parents by an attribue (node is not included).
     *
     * @param {string|number|array} _val Value or array of values.
     * @param {int|string} _key If data item is array then _key is index into that array, otherwise it's key of an object.
     * @param {*} _idOrNode
     * @param {*} [_endParentNode] Id or node.
     * @param {boolean} [_getObjectIds]
     * @param {boolean} [_getFirstParent] Get just first parent's match.
     * @return {array|object|null} Array of nodes.
     */
    getParentsBy(_val, _key, _idOrNode, _endParentNode, _getObjectIds, _getFirstParent) {
        let node = this._getNode(_idOrNode, true);
        const endParentNode = _endParentNode ? this._getNode(_endParentNode, true) : null;
        const parents = [];
        const vals = isArray(_val) ? _val : [_val];

        if (node) {
            node = node._p;
            while (node && node._p !== endParentNode) {
                if (inArray(node[_key], vals) > -1) {
                    parents.push(_getObjectIds ? node._componentId : node);

                    if (_getFirstParent) {
                        break;
                    }
                }

                node = node._p;
            }
        }

        if (!_getFirstParent) {
            return parents;
        }
        if (parents.length > 0) {
            return parents[0];
        }
        return null;
    }

    /**
     * Get child of node by index.
     *
     * @param {object} _node
     * @param {int} _idx
     * @return {object|null} Node.
     */
    getChildByIdx(_node, _idx) {
        let childNode = null;
        let children = null;

        if (_node && _idx >= 0) {
            children = _node._c;
            if (children && children.length > 0 && children[_idx] !== undefined) {
                childNode = children[_idx];
            }
        }

        return childNode;
    }

    /**
     * @param {object} _node
     * @return {object|null} Node.
     */
    getPrevNode(_node) {
        return this._getPrevOrNextNode(_node);
    }

    /**
     * @param {object} _node
     * @return {object|null} Node.
     */
    getNextNode(_node) {
        return this._getPrevOrNextNode(_node, true);
    }

    /**
     * @param {object} _node
     * @param {boolean} [_next]
     * @return {object|null} Node.
     */
    _getPrevOrNextNode(_node, _next) {
        let node = null;
        let idx = -1;
        let children = null;

        if (_node) {
            idx = this.getNodeIdx(_node);
            if (idx > -1) {
                children = _node._p._c;
                if (children) {
                    if (_next) {
                        if (idx + 1 <= children.length - 1) {
                            node = children[idx + 1];
                        }
                    } else if (idx - 1 >= 0) {
                        node = children[idx - 1];
                    }
                }
            }
        }

        return node;
    }

    /**
     * Get child of node by index.
     *
     * @param {*} _idOrNode
     * @return {Array}
     */
    getSiblings(_idOrNode) {
        const node = this._getNode(_idOrNode, true);
        const siblings = [];
        let children;

        if (node._p) {
            children = node._p._c;
            for (let i = 0, len1 = children.length; i < len1; i++) {
                if (children[i] !== node) {
                    siblings.push(children[i]);
                }
            }
        }

        return siblings;
    }

    /**
     * Get node by id.
     *
     * @param {int|string} _id Id of node (index 0 or .id property).
     * @return {object|null} Node.
     */
    get(_id) {
        return this.dataL[_id] || null;
    }

    /**
     * Get node(s) by value and key.
     *
     * @param {string|number} _val
     * @param {int|string} _key If data item is array then _key is index into that array, otherwise it's key of an object.
     * @param {boolean} [_findAll] If true, find all possible occurrences, otherwise find only the first one.
     * @return {*} Item (or null) or array of items.
     */
    getBy(_val, _key, _findAll) {
        const data = this.dataL;
        let node = _findAll ? [] : null;
        let n = null;

        // get by id
        if (_key === 'id') {
            return this.get(_val);
        }

        for (const i in data) {
            n = data[i];
            if (n[_key] == _val) {
                if (_findAll) {
                    node.push(data[i]);
                } else {
                    node = data[i];
                    break;
                }
            }
        }

        return node;
    }

    /**
     * Get node(s) by value and key, search nodes recursively.
     * If `_startNode` is specified, start searching from this node, it won't be
     * included in search result.
     *
     * @param {string|number} _val
     * @param {int|string} _key If data item is array then _key is index into that array, otherwise it's key of an object.
     * @param {object|string} [_startNode] Start node or path.
     * @param {boolean} [_findAll] If true, find all possible occurrences, otherwise find only the first one.
     * @return {*} Item or array of items.
     */
    getByR(_val, _key, _startNode, _findAll) {
        const startNode = this._getNode(_startNode) || this._root;
        const nodes = [];
        const self = this;

        // get by id
        if (_key === 'id') {
            return this.get(_val);
        }

        this.walk(startNode, {
            // walkType: 'render',
            onDataWrap(_node) {
                return self._getByR(_node, _val, _key, nodes, _findAll);
            },
            onDataNode(_node) {
                return self._getByR(_node, _val, _key, nodes, _findAll);
            },
        });

        for (let i = 0, len1 = nodes.length; i < len1; i++) {
            delete nodes[i].__found;
        }

        if (_findAll) {
            return nodes;
        }
        if (nodes.length > 0) {
            return nodes[0];
        }
        return null;
    }

    /**
     * Private function for tree walking in `getByR` method.
     *
     * @param {object} _node Tree node.
     * @param {string|number} _val
     * @param {int|string} _key If data item is array then _key is index into that array, otherwise it's key of an object.
     * @param {array} _result
     * @param {boolean} [_findAll] If true, find all possible occurrences, otherwise find only the first one.
     * @return {boolean}
     */
    _getByR(_node, _val, _key, _result, _findAll) {
        let found = false;

        if (_node[_key] == _val) {
            if (!_node.__found) {
                _node.__found = true;
                _result.push(_node);
            }
            found = true;
        }

        return !(!_findAll && found);
    }

    /**
     * Find node's position (index) in `_node._p._c` array.
     *
     * @param {object} _node
     * @return {int} -1 if fail.
     */
    getNodeIdx(_node) {
        let children = null;

        if (!_node || !_node._p || !_node._p._c) {
            return -1;
        }

        children = _node._p._c;
        for (let i = 0, len = children.length; i < len; i++) {
            if (children[i] === _node) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Get node's id.
     *
     * @param {object} _node
     * @return {*}
     */
    getNodeId(_node) {
        if (_node) {
            if (_node._p === null) {
                // root
                return 0;
            }

            return _node.id;
        }
        return 0;
    }
}
