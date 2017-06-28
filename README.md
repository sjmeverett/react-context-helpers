# react-context-helpers

Helpers to convert from props to context and back again.

In a nutshell, it provides two higher-order components, one for converting props to context, and one for for converting context to props.

## Usage

Install:

    $ yarn add react-context-helpers

Import, then define your components:

```js
import { contextProvider, contextToProps } from 'react-context-helpers';

const contextTypes = {
  colour: React.PropTypes.string
};

// define a context provider and a context consumer
const Theme = contextProvider(contextTypes)(
  (props) => <div>{props.children}</div>
);

const ColouredButton = contextToProps(contextTypes)(
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
