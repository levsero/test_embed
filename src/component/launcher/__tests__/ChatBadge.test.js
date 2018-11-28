import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';
import ChatBadgeConnect from '../ChatBadge';
const ChatBadge = ChatBadgeConnect.WrappedComponent;

const noop = () => {
  // noop
};

const renderComponent = (props = {}) => {
  const defaultProps = {
    onSend: noop,
    handleChatBadgeMessageChange: noop,
    resetCurrentMessage: noop,
    sendMsg: noop,
    handleChatBadgeMinimize: noop,
    updateChatScreen: noop,
    bannerSettings: {}
  };

  const mergedProps = {...defaultProps, ...props};

  return render(<ChatBadge {...mergedProps} />);
};

test('renders the component', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

test('with chatBadgeColor passed in', () => {
  const chatBadgeColor = { text: 'blue', base: 'yellow' };
  const { container } = renderComponent({ chatBadgeColor });

  expect(container)
    .toMatchSnapshot();
});

test('with label passed in', () => {
  const bannerSettings = { label: 'wanna chat?' };
  const { container } = renderComponent({bannerSettings});

  expect(container)
    .toMatchSnapshot();
});
