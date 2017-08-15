import test from 'ava';
import { contextProvider, contextConsumer } from '../lib';
import { shallow, mount } from 'enzyme';
import * as React from 'react';
import * as PropTypes from 'prop-types';

require('jsdom-global')();

interface TestContext {
  foo: string;
}

test('contextProvider / contextConsumer', (t) => {
  const Provider = contextProvider<TestContext>('test', ['foo']);

  const Consumer = contextConsumer<TestContext>('test')(
    (props) => <span>{props.foo}</span>
  );

  const wrapper = mount(
    <Provider foo='hello'>
      <Consumer />
    </Provider>
  );

  const span = wrapper.find('span');
  t.is(span.text(), 'hello');

  wrapper.setProps({foo: 'bye'});
  t.is(span.text(), 'bye');
});
