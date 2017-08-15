# react-context-helpers

Helpers to convert from props to context and back again.

In the box, you get:

* `contextProvider(name: string, keys: string[])` - creates a provider component for the given context key
* `contextConsumer(name: string)` - creates a component decorator that will feed the context as props into the wrapped component

If the context changes, the consumers are notified of the change.

_Rewritten entirely from v1.0 as this was fundamentally broken._

## Usage

Install:

    $ npm install --save react-context-helpers

Import, then define your components:

```js
import { contextProvider, contextConsumer } from 'react-context-helpers';

interface ThemeContext {
  colour: string;
}

// define a context provider and a context consumer
const Theme = contextProvider<ThemeContext>('theme');

const ColouredButton = contextConsumer<ThemeContext>('theme')(
  (props) => <button style={{background: props.colour}}>{props.children}</button>
);

const app = () => (
  <Theme colour='red'>
    <h1>Demo</h1>
    <div className='box'>
      <ColouredButton>Click me</ColouredButon>
    </div>
  </Theme>
);

```
