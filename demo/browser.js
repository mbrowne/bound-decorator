// bound.js is a CommonJS module to avoid the need for a build step for the decorator itself, so we need
// this little workaround
import '../src/bound.js'
const bound = window.exports.default

// Adapted from example in https://github.com/tc39/proposal-decorators
class Counter extends HTMLElement {
    count = 0

    @bound
    clicked() {
        this.count++
        window.requestAnimationFrame(() => this.render())
    }

    constructor() {
        super()
        this.onclick = this.clicked
    }

    connectedCallback() {
        this.render()
    }

    render() {
        this.textContent = this.count.toString()
    }
}

window.customElements.define('num-counter', Counter)

// @TODO (once Babel supports private methods)
/*
class Counter extends HTMLElement {
    #count = 0

    @bound
    #clicked() {
        this.#count++
        window.requestAnimationFrame(() => this.render())
    }

    constructor() {
        super()
        this.onclick = this.#clicked
    }

    connectedCallback() {
        this.render()
    }

    render() {
        this.textContent = this.#count.toString()
    }
}
*/
