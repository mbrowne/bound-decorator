# @bound decorator

Decorator for creating bound methods using Babel 7 (sometimes referred to as "autobinding").

> Note: This decorator is not compatible with `legacy` mode for decorators, regardless of your Babel version.
>
> Also note that the ECMAScript [decorators proposal](https://github.com/tc39/proposal-decorators) is in the process of being redesigned. This redesign first became public in early 2019 and is still ongoing. As of January 2020, [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) is still based on the original stage 2 proposal, so this library is still fully compatible with it.

For Babel 6 and for TypeScript (at least as of 2018), you might be interested in these alternatives:

-   https://github.com/brigand/class-bind
-   https://github.com/andreypopp/autobind-decorator

## Installation

```bash
npm i -S bound-decorator
```

Or:

```bash
yarn add bound-decorator
```

## Usage

Simply add `@bound` to the method you want to be bound:

```js
import bound from 'bound-decorator'

@bound
handleClick() {}
```

## Example

Using React:

```js
class Counter extends React.Component {
    state = {
        count: 0
    }

    @bound
    handleClick() {
        this.setState({ count: this.state.count + 1 })
    }

    render() {
        return <div onClick={this.handleClick}>{this.state.count}</div>
    }
}
```

See also the [demo](https://github.com/mbrowne/bound-decorator/tree/master/demo) directory.

## Motivation

See [MOTIVATION.md](https://github.com/mbrowne/bound-decorator/blob/master/MOTIVATION.md)

## License

ISC
