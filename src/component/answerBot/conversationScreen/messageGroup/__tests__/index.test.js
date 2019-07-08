import { render } from 'react-testing-library';
import React from 'react';

import { Component as MessageGroup } from '../index';

const textMessage = {
  type: 'text',
  message: 'hello',
  author: 'AUTHOR_VISITOR',
  timestamp: Date.now(),
  sessionID: 1234
};

jest.useFakeTimers();

const messages = [textMessage];

const renderComponent = (props = {}) => {
  const defaultProps = {
    messages: messages,
    isVisitor: false,
    agentAvatarName: 'Answer Bot'
  };

  const componentProps = {
    ...defaultProps,
    ...props
  };

  const utils = render(<MessageGroup {...componentProps} />);

  jest.runAllTimers(); // let the animation finish

  return utils;
};

test('renders expected classes and components with default props', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

describe('bot', () => {
  describe('name', () => {
    it('renders agent name', () => {
      const { container } = renderComponent({
        agentAvatarName: 'Bond'
      });

      expect(container)
        .toMatchSnapshot();
    });
  });

  describe('avatar', () => {
    it('renders brand logo', () => {
      const { container } = renderComponent({
        brandLogoUrl: 'http://url'
      });

      expect(container)
        .toMatchSnapshot();
    });

    it('renders agent avatar', () => {
      const { container } = renderComponent({
        agentAvatarUrl: 'http://url'
      });

      expect(container)
        .toMatchSnapshot();
    });
  });
  describe('messages', () => {
    it('animates messages', () => {
      const messages = [
        { timestamp: 1, text: 'first' },
        { timestamp: 2, text: 'second' },
        { timestamp: 3, text: 'third' }
      ];

      const { container } = render(<MessageGroup
        lastConversationScreenClosed={1}
        isVisitor={false}
        messages={messages}
      />);

      expect(container.querySelectorAll('.botMessage').length)
        .toEqual(1);

      jest.advanceTimersByTime(1000);
      expect(container.querySelectorAll('.botMessage').length)
        .toEqual(2);

      jest.advanceTimersByTime(1000);
      expect(container.querySelectorAll('.botMessage').length)
        .toEqual(3);
    });
  });
});

describe('visitor', () => {
  describe('name and avatar', () => {
    it('renders nothing', () => {
      const { container } = renderComponent({ isVisitor: true });

      expect(container)
        .toMatchSnapshot();
    });
  });

  describe('messages', () => {
    it('runs callbacks of old messages', () => {
      const callback1 = jest.fn(),
        callback3 = jest.fn();
      const messages = [
        { timestamp: 1, text: 'first', callback: callback1 },
        { timestamp: 2, text: 'second' },
        { timestamp: 3, text: 'third', callback: callback3 }
      ];

      renderComponent({ lastConversationScreenClosed: 1, isVisitor: true, messages });
      expect(callback1)
        .toHaveBeenCalled();
    });
  });
});
