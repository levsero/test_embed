import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from 'src/redux/modules/reducer';
import Navigation from '../Navigation';
import * as selectors from 'src/redux/modules/chat/chat-selectors';

test('can hide the close button', () => {
  const store = createStore(reducer);

  const { container } = render(
    <Provider store={store}>
      <Navigation hideCloseButton={true} />
    </Provider>,
  );

  expect(container.querySelector('button[aria-label=Close]'))
    .not.toBeInTheDocument();
});

test('renders the close button by default', () => {
  const store = createStore(reducer);

  const { container } = render(
    <Provider store={store}>
      <Navigation />
    </Provider>,
  );

  expect(container.querySelector('button[aria-label=Close]'))
    .toBeInTheDocument();
});

test('can render the popout button', () => {
  selectors.getIsPopoutAvailable = jest.fn(() => true);

  const store = createStore(reducer);
  const { container } = render(
    <Provider store={store}>
      <Navigation hidePopoutButton={false} />
    </Provider>
  );

  expect(container.querySelector('button[aria-label=Popout]')).toBeInTheDocument();
});

test('can hide the popout button', () => {
  selectors.getIsPopoutAvailable = jest.fn(() => false);
  const store = createStore(reducer);

  const { container } = render(
    <Provider store={store}>
      <Navigation hidePopoutButton={true}/>
    </Provider>,
  );

  expect(container.querySelector('button[aria-label=Popout]'))
    .not.toBeInTheDocument();
});
