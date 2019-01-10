import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';

import { PureConversationScreen as ConversationScreen } from '../index';

const actions = Object.freeze({
  conversationScreenClosed: jest.fn(),
  updateBackButtonVisibility: jest.fn()
});

const renderComponent = (props = {}) => {
  const defaultProps = {
    messageGroups: {},
    actions
  };

  const componentProps = {
    ...defaultProps,
    ...props
  };

  return render(<ConversationScreen {...componentProps} />);
};

test('renders messages', () => {
  const { container } = renderComponent();

  expect(container.querySelector('.messages'))
    .toBeInTheDocument();
});

test('calls updateBackButtonVisibility on mount', () => {
  renderComponent();

  expect(actions.updateBackButtonVisibility)
    .toHaveBeenCalledWith(false);
});

test('calls conversationScreenClosed on unmount', () => {
  const { unmount } = renderComponent();

  unmount();
  expect(actions.conversationScreenClosed)
    .toHaveBeenCalled();
});
