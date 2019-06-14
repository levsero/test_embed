import 'utility/i18nTestHelper';
import _ from 'lodash';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { http } from 'service/transport';

import { Component as ArticleScreen } from '../index';

http.init({
  zendeskHost: 'a.zendesk.com'
});

jest.useFakeTimers();

const actions = Object.freeze({
  botFeedbackRequested: jest.fn(),
  botFeedbackMessage: jest.fn(),
  articleDismissed: jest.fn(),
  botMessage: jest.fn(),
  sessionFallback: jest.fn(),
  screenChanged: jest.fn(),
  sessionResolved: jest.fn(),
  botFallbackMessage: jest.fn()
});

const renderComponent = (props = {}) => {
  const defaultProps = {
    article: {},
    isFeedbackRequired: false,
    actions
  };

  const componentProps = _.merge({}, defaultProps, props);

  return render(<ArticleScreen {...componentProps} />);
};

test('renders the expected classes', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

test('renders the expected mobile classes', () => {
  const { container } = renderComponent({
    isMobile: true
  });

  expect(container)
    .toMatchSnapshot();
});

test('renders the expected title', () => {
  const { container } = renderComponent({
    articleTitleKey: 'support'
  });

  expect(container)
    .toMatchSnapshot();
});

test('passing of scroll container classes', () => {
  const { container } = renderComponent({
    scrollContainerClasses: 'this is a class'
  });

  expect(container)
    .toMatchSnapshot();
});

test('renders the help center article', () => {
  const { container } = renderComponent({
    article: {
      id: 123,
      markedAsIrrelevant: false,
      title: 'title',
      body: '<p>body</p>'
    }
  });

  expect(container)
    .toMatchSnapshot();
});

test('renders the feedback popup after a certain time has passed', () => {
  const { container } = renderComponent({
    isFeedbackRequired: true
  });

  jest.runAllTimers();
  expect(container)
    .toMatchSnapshot();
});

test('does not render the feedback popup if feedback is not required', () => {
  const { container } = renderComponent({
    isFeedbackRequired: false
  });

  jest.runAllTimers();
  expect(container)
    .toMatchSnapshot();
});

describe('feedback actions', () => {
  describe('on yes click', () => {
    it('hides the feedback popup', () => {
      const { container, getByText } = renderComponent({
        isFeedbackRequired: true
      });

      jest.runAllTimers();
      fireEvent.click(getByText('Yes'));
      jest.runAllTimers();
      expect(container)
        .toMatchSnapshot();
    });

    it('fires the expected actions', () => {
      const saveConversationScroll = jest.fn();
      const { getByText } = renderComponent({
        isFeedbackRequired: true,
        saveConversationScroll
      });

      jest.runAllTimers();
      fireEvent.click(getByText('Yes'));
      expect(actions.botFeedbackRequested)
        .toHaveBeenCalled();
      expect(actions.botMessage)
        .toHaveBeenNthCalledWith(1, 'Nice. Knowledge is power.');
      expect(actions.botMessage)
        .toHaveBeenNthCalledWith(2, "If there's anything else I can find for you, just type another question.");
      expect(actions.sessionResolved)
        .toHaveBeenCalled();
      expect(saveConversationScroll)
        .toHaveBeenCalledWith({ scrollToBottom: true });
    });
  });

  describe('on no click', () => {
    it('asks for the reason', () => {
      const { container, getByText } = renderComponent({
        isFeedbackRequired: true
      });

      jest.runAllTimers();
      fireEvent.click(getByText('No, I need help'));
      expect(container)
        .toMatchSnapshot();
    });

    describe('on reason click', () => {
      it('dispatches the expected actions', () => {
        const saveConversationScroll = jest.fn();
        const { getByText } = renderComponent({
          isFeedbackRequired: true,
          saveConversationScroll
        });

        jest.runAllTimers();
        fireEvent.click(getByText('No, I need help'));
        fireEvent.click(getByText("It's related, but it didn't answer my question"));
        expect(actions.botFeedbackRequested)
          .toHaveBeenCalled();
        expect(actions.botFeedbackMessage)
          .toHaveBeenNthCalledWith(1, 'I see. Your question is still unresolved.');
        expect(actions.botFallbackMessage)
          .toHaveBeenCalledWith(true);
        expect(actions.articleDismissed)
          .toHaveBeenCalledWith(2);
        expect(actions.botMessage)
          .not.toHaveBeenCalled();
        expect(actions.sessionFallback)
          .toHaveBeenCalled();
        expect(saveConversationScroll)
          .toHaveBeenCalledWith({ scrollToBottom: true });
        expect(actions.screenChanged)
          .toHaveBeenCalledWith('conversation');
      });
    });
  });
});
