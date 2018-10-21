import bound from '../src/bound'

class ComponentWithPublicProperties {
    x = 1

    @bound
    handleClick() {
        console.log('this.x = ', this.x)
    }

    simulateClick() {
        const handler = this.handleClick
        handler()
    }
}

// @TODO (once Babel supports private methods)
/*
class ComponentWithPrivateProperties {
    #x = 1

    @bound
    #handleClick() {
        console.log('this.#x = ', this.#x)
    }

    simulateClick() {
        const handler = this.#handleClick
        handler()
    }
}
*/

new ComponentWithPublicProperties().simulateClick()
// new ComponentWithPrivateProperties().simulateClick()
