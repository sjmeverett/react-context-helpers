import test from 'ava';
import { contextProvider, contextToProps } from '../lib';
import { shallow, mount } from 'enzyme';
import * as React from 'react';
import * as PropTypes from 'prop-types';

require('jsdom-global')();

interface ContextTypes {
  foo: string;
}

const contextTypes = {
  foo: PropTypes.string
}

test('contextProvider', (t) => {
  t.plan(2);

  const Provider = contextProvider<ContextTypes, {baz: string}>(contextTypes)((props) => {
    t.deepEqual(props.baz, 'bang');
    return <div>{props.children}</div>;
  });

  const Consumer: React.StatelessComponent<any> = (props, context) => {
    t.deepEqual(context, {foo: 'bar'});
    return <span />;
  };

  Consumer.contextTypes = contextTypes;

  mount(
    <Provider foo='bar' baz='bang'>
      <Consumer />
    </Provider>
  );
});


test('contextProvider with pass-through', (t) => {
  t.plan(2);

  const Provider = contextProvider<ContextTypes>(contextTypes, true)((props) => {
    t.deepEqual(props.foo, 'bar');
    return <div>{props.children}</div>;
  });

  const Consumer: React.StatelessComponent<any> = (props, context) => {
    t.deepEqual(context, {foo: 'bar'});
    return <span />;
  };

  Consumer.contextTypes = contextTypes;

  mount(
    <Provider foo='bar'>
      <Consumer />
    </Provider>
  );
});


test('contextProvider with pass-through array', (t) => {
  t.plan(2);

  const Provider = contextProvider<ContextTypes>(contextTypes, ['foo'])((props) => {
    t.deepEqual(props.foo, 'bar');
    return <div>{props.children}</div>;
  });

  const Consumer: React.StatelessComponent<any> = (props, context) => {
    t.deepEqual(context, {foo: 'bar'});
    return <span />;
  };

  Consumer.contextTypes = contextTypes;

  mount(
    <Provider foo='bar'>
      <Consumer />
    </Provider>
  );
});


test('contextToProps', (t) => {
  t.plan(1);

  class Provider extends React.Component<any, any> {
    static childContextTypes = contextTypes;

    getChildContext() {
      return {
        foo: 'bar'
      };
    }

    render() {
      return <div>{this.props.children}</div>;
    }
  }

  const Consumer = contextToProps<ContextTypes>(contextTypes)((props) => {
    t.deepEqual(props, {foo: 'bar'});
    return <span/>;
  });

  mount(
    <Provider foo='bar'>
      <Consumer />
    </Provider>
  );
});
