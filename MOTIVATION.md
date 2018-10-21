# Motivation for the `@bound` decorator

You may have seen the following pattern for creating bound methods and be wondering why a `@bound` decorator would be preferred over this:

```js
class Counter extends React.Component {
    state = {
        count: 0
    }

    handleClick = () => {
        this.setState({ count: this.state.count + 1 })
    }

    ...
}
```

(Note: this decorator is generally useful, and doesn't only apply to React; a React event handler is just an example.)

This is still a subject of some debate, but there are certainly valid reasons to prefer the decorator implementation:

### Mocking

The arrow function version is equivalent to the following:

```js
class Counter extends React.Component {
    ...

    constructor() {
        super()
        this.handleClick = () => {
            this.setState({ count: this.state.count + 1 })
        }
    }

    ...
}
```

Therefore, the `handleClick` method no longer exists on `Counter`'s prototype. Suppose our `Counter` class had a couple other regular methods in addition to `handleClick`:

```js
class Counter extends React.Component {
    ...
    foo() {...}
    bar() {...}
    ...
}
```

Then those methods would be defined on the prototype:

```js
Counter.prototype.foo // defined
Counter.prototype.bar // defined
```

But `handleClick` would not:

```js
Counter.prototype.handleClick // undefined
```

It usually makes sense to put mock methods on the prototype, not on each instance separately—and this is how many testing libraries work, e.g. Enzyme, when you ask them to create a mock or spy method:

```js
Counter.prototype.handleClick = mockMethod
```

But this prototype method will be ignored, because `this.handleClick` (own property) takes priority in the prototype chain.

### Inheritance

As we saw above, using arrow functions in class field initializers causes the method to be absent from the prototype. This can lead to unexpected results when using inheritance.

React components don't usually inherit from one another (in many cases this is an anti-pattern), but if you ever do have a valid use case for inheritance, you will have a big problem. (And of course there are many other use cases for inheritance in conjunction with bound methods, including classes that have nothing to do with React.)

So, continuing with our running example (even though this use of inheritance isn't realistic), suppose we have a subclass of `Counter` with its own `handleClick` method:

```js
class Counter extends React.Component {
    ...
    handleClick = () => {
        this.setState({ count: this.state.count + 1 })
    }
    ...
}

class SpecialCounter extends Counter {
    handleClick() {
        console.log("SpecialCounter clicked")
    }
    ...
}

const specialCounter = new SpecialCounter()
// Which method gets called?
specialCounter.handleClick()
// (Note: this example is for illustrative purposes only; obviously we wouldn't really call handleClick() manually)
```

In the above example, the expectation is that you are calling the `handleClick` method in the `SpecialCounter` class, but in fact that method is not called at all because the JS engine first looks for property values in the instance before it looks at the prototype. The method that is actually called is the `handleClick` method in the parent `Counter` class.

`super` calls can also break unexpectedly:

```js
class SpecialCounter extends Counter {
    ...
    handleClick = () => {
        // Uncaught TypeError: (intermediate value).handleClick is not a function
        super.handleClick()
    }
    ...
}
```

### Comparison with `@bound` decorator

Let's consider some alternative implementations of our example:

```js
// Version A
class Counter extends React.Component {
    ...
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState({ count: this.state.count + 1 })
    }
    ...
}

// Version B
class Counter extends React.Component {
    ...
    handleClick = () => {
        this.setState({ count: this.state.count + 1 })
    }
    ...
}

// Version C
class Counter extends React.Component {
    ...
    handleClick = this.handleClick.bind(this)

    handleClick() {
        this.setState({ count: this.state.count + 1 })
    }
    ...
}

// Version D
class Counter extends React.Component {
    ...
    @bound
    handleClick() {
        this.setState({ count: this.state.count + 1 })
    }
    ...
}
```

It's generally agreed that concise, expressive code is preferable as long as it doesn't hide important details. From this perspective, versions B and D have the advantage. Version D (using the decorator) is often preferable to version B for the reasons explained above. Version C is the next most concise version that also avoids the issues with arrow functions, but it still requires that you call `bind()` manually for every function you want to bind. So version D wins both for conciseness and avoiding issues with arrow functions.

Having said all that, the `@bound` decorator does not perfectly prevent all issues relating to bound functions and inheritance. For example, consider this:

```js
class Parent {
    @bound
    foo() {
        console.log('Parent')
    }
}

class Child extends Parent {
    constructor() {
        super()
        // Logs "Parent", not "Child"
        this.foo()
    }

    foo() {
        console.log('Child')
    }
}
```

But there are still significantly fewer prototype and inheritance-related issues with the `@bound` decorator than there are with fields initialized to arrow functions.

### Counterarguments

Some people argue that the above issues are not sufficient reason to avoid arrow functions in class fields entirely, depending on your app. Obviously, in parts of your app where you are using inheritance, the arguments against arrow functions are more persuasive. There are also performance considerations when choosing between the two approaches. The performance differences are usually negligible but can be more significant in cases where you have hundreds or thousands of instances of a class. If you were to simply use arrow functions everywhere without thinking about the consequences, that could cause problems. Of course the same would be true of careless use of the `@bound` decorator. A full comparison of all the pros and cons in different situations is beyond the scope of this article. Suffice it to say that arrow functions are not an ideal solution in all situations, and the motivation to want a `@bound` decorator is realistic.
