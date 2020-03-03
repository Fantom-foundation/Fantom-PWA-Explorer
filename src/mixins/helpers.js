import shortid from 'shortid';

export default {
    methods: {
        /**
         * Generate unique id if there is no 'id' property in object.
         *
         * @param {array} _items
         */
        setIds(_items) {
            if (_items && _items.length) {
                for (let i = 0, len1 = _items.length; i < len1; i += 1) {
                    if (!('id' in _items[i])) {
                        _items[i].id = shortid.generate();
                    }
                }
            }
        }
    }
}
