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
    const { value } = descriptor
    function initializer() {
        return value.bind(this)
    }
    elementDescriptor.extras = [
        {
            kind: 'field',
            key,
            placement: 'own',
            initializer,
            // Return both the original method and a bound function field that calls the method.
            // (That way the original method will still exist on the prototype, avoiding
            // confusing side-effects.)
            descriptor: { ...descriptor, value: undefined }
        }
    ]
    return elementDescriptor
}
