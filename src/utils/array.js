/**
 * Shuffles an array.
 *
 * @param {Array} _array
 */
export function shuffle(_array) {
    for (let i = _array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

        [_array[i], _array[j]] = [_array[j], _array[i]];
    }
}
