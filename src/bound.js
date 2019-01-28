'use strict'

Object.defineProperty(exports, '__esModule', {
    value: true
})
exports.default = bound

function bound(elementDescriptor) {
    const { kind, key, descriptor } = elementDescriptor
    if (kind !== 'method') {
        throw Error('@bound decorator can only be used on methods')
    }
    const method = descriptor.value
    const initializer =
        // check for private method
        typeof key === 'object'
            ? function() {
                  return method.bind(this)
              }
            : // For public and symbol-keyed methods (which are technically public),
              // we defer method lookup until construction to respect the prototype chain.
              function() {
                  return this[key].bind(this)
              }

    // Return both the original method and a bound function field that calls the method.
    // (That way the original method will still exist on the prototype, avoiding
    // confusing side-effects.)
    elementDescriptor.extras = [
        {
            kind: 'field',
            key,
            placement: 'own',
            initializer,
            descriptor: { ...descriptor, value: undefined }
        }
    ]
    return elementDescriptor
}
