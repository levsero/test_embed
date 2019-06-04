import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';

import { CONVERSATION_SCREEN, ARTICLE_SCREEN } from 'src/constants/answerBot';

import { Component as AnswerBotContainer } from '../AnswerBotContainer';

jest.useFakeTimers();

const actions = Object.freeze({
  sessionStarted: jest.fn(),
  sessionFallback: jest.fn(),
  botMessage: jest.fn(),
  botChannelChoice: jest.fn(),
  botGreeted: jest.fn(),
  botInitialFallback: jest.fn(),
  inputDisabled: jest.fn(),
  botFeedback: jest.fn(),
  botFeedbackRequested: jest.fn(),
  botFeedbackMessage: jest.fn(),
  botTyping: jest.fn(),
  botContextualSearchResults: jest.fn(),
  contextualSearchFinished: jest.fn()
});

const renderComponent = (props = {}, renderFn) => {
  const defaultProps = {
    sessions: {},
    currentSessionResolved: false,
    sessionFallbackSuggested: false,
    sessionArticlesLength: 0,
    currentScreen: CONVERSATION_SCREEN,
    currentMessage: 'current message',
    isInitialSession: true,
    greeted: false,
    initialFallbackSuggested: false,
    isFeedbackRequired: false,
    actions,
    delayInitialFallback: false,
  };
  const componentProps = {
    ...defaultProps,
    ...props
  };
  const component = (<AnswerBotContainer {...componentProps}>
    <div className="child">hello</div>
  </AnswerBotContainer>);

  return renderFn ? renderFn(component) : render(component);
};

test('renders children', () => {
  const { container } = renderComponent();

  expect(container.querySelector('div.child'))
    .toBeInTheDocument();
});

describe('sessionStarted', () => {
  it('starts session if there is no current session id', () => {
    renderComponent();
    expect(actions.sessionStarted)
      .toHaveBeenCalled();
  });

  it('does not start session if there is a current session id', () => {
    renderComponent({ currentSessionID: 1234 });
    expect(actions.sessionStarted)
      .not.toHaveBeenCalled();
  });
});

describe('scroll position', () => {
  it('saves scroll position when we go from conversation to article', () => {
    const handler = jest.fn();
    const { rerender } = renderComponent({ saveConversationScroll: handler, currentScreen: CONVERSATION_SCREEN });

    renderComponent({ currentScreen: ARTICLE_SCREEN }, rerender);
    expect(handler)
      .toHaveBeenCalled();
  });

  it('restores scroll position when we go from article to conversation', () => {
    const handler = jest.fn();
    const { rerender } = renderComponent({ restoreConversationScroll: handler, currentScreen: ARTICLE_SCREEN });

    renderComponent({ currentScreen: CONVERSATION_SCREEN }, rerender);
    expect(handler)
      .toHaveBeenCalled();
  });
});

describe('greeting', () => {
  it('greets if it has not greeted before', () => {
    renderComponent({ currentSessionID: 1234, isInitialSession: true });

    expect(actions.botGreeted)
      .toHaveBeenCalled();
    expect(actions.botMessage)
      .toHaveBeenNthCalledWith(1, 'Hello.');
    expect(actions.botMessage)
      .toHaveBeenNthCalledWith(2, "Ask me a question and I'll find the answer for you.", expect.any(Function));
  });

  it('does not greet if it is article screen', () => {
    renderComponent({ currentSessionID: 1234, isInitialSession: true, currentScreen: ARTICLE_SCREEN });

    expect(actions.botGreeted)
      .not.toHaveBeenCalled();
  });

  it('greets with brand it brand is available', () => {
    renderComponent({ brand: 'Wayne', currentSessionID: 1234, isInitialSession: true });

    expect(actions.botMessage)
      .toHaveBeenNthCalledWith(1, 'Hi! Welcome to Wayne.');
  });

  it('does not greet if it has greeted before', () => {
    renderComponent({ greeted: true, currentSessionID: 1234, isInitialSession: true });

    expect(actions.botGreeted)
      .not.toHaveBeenCalled();
  });

  it('does not prompt for question if there is a contextual search', () => {
    renderComponent({ contextualSearchStatus: 'PENDING', currentSessionID: 1234, isInitialSession: true });

    expect(actions.botGreeted)
      .toHaveBeenCalled();
    expect(actions.botMessage)
      .toHaveBeenNthCalledWith(1, 'Hello.');
    expect(actions.botMessage)
      .not.toHaveBeenNthCalledWith(2, "Ask me a question and I'll find the answer for you.", expect.any(Function));
  });
});

describe('contextual search', () => {
  it('shows bot typing when contextual search is still pending', () => {
    renderComponent({ contextualSearchStatus: 'PENDING', currentSessionID: 1234, isInitialSession: true });

    expect(actions.botTyping)
      .toHaveBeenCalled();
  });

  it('shows the contextual search results when request completes', () => {
    renderComponent({
      contextualSearchResultsCount: 3,
      contextualSearchStatus: 'COMPLETED',
      currentSessionID: 1234,
      isInitialSession: true
    });

    expect(actions.botMessage)
      .toHaveBeenNthCalledWith(2, 'Here are some top suggestions for you:');
    expect(actions.botContextualSearchResults)
      .toHaveBeenCalled();
  });

  it('shows the proper contextual search result message when request completes and there is only one result', () => {
    renderComponent({
      contextualSearchResultsCount: 1,
      contextualSearchStatus: 'COMPLETED',
      currentSessionID: 1234,
      isInitialSession: true
    });

    expect(actions.botMessage)
      .toHaveBeenNthCalledWith(2, 'Here is the top suggestion for you:');
    expect(actions.botContextualSearchResults)
      .toHaveBeenCalled();
  });

  it('shows the normal prompt when there are no contextual search results', () => {
    renderComponent({ contextualSearchStatus: 'NO_RESULTS', currentSessionID: 1234, isInitialSession: true });

    expect(actions.botMessage)
      .toHaveBeenNthCalledWith(2, "Ask me a question and I'll find the answer for you.", expect.any(Function));
  });

  it('does not prompt again if contextual search has finished', () => {
    renderComponent({
      contextualSearchFinished: true,
      contextualSearchStatus: 'NO_RESULTS',
      currentSessionID: 1234,
      isInitialSession: true
    });

    expect(actions.botMessage)
      .not.toHaveBeenNthCalledWith(2, "Ask me a question and I'll find the answer for you.", expect.any(Function));
  });
});

describe('in-conversation feedback', () => {
  it('shows after going from article to conversation and feedback is required', () => {
    const { rerender } = renderComponent({ currentSessionID: 1234, currentScreen: ARTICLE_SCREEN });

    renderComponent({ currentSessionID: 1234, currentScreen: CONVERSATION_SCREEN, isFeedbackRequired: true }, rerender);

    expect(actions.botFeedbackRequested)
      .toHaveBeenCalled();
    expect(actions.inputDisabled)
      .toHaveBeenCalledWith(true);
    expect(actions.botFeedback)
      .toHaveBeenCalled();
    expect(actions.botFeedbackMessage)
      .toHaveBeenCalledWith('Did the article you viewed help to answer your question?');
  });

  it('does not show if current screen is article screen', () => {
    const { rerender } = renderComponent({ currentSessionID: 1234, currentScreen: ARTICLE_SCREEN });

    renderComponent({ currentSessionID: 1234, currentScreen: ARTICLE_SCREEN, isFeedbackRequired: true }, rerender);

    expect(actions.botFeedbackRequested)
      .not.toHaveBeenCalled();
  });

  it('does not show the feedback if feedback is not required', () => {
    const { rerender } = renderComponent({ currentSessionID: 1234, currentScreen: ARTICLE_SCREEN });

    renderComponent({
      currentSessionID: 1234,
      currentScreen: CONVERSATION_SCREEN,
      isFeedbackRequired: false
    }, rerender);

    expect(actions.botFeedbackRequested)
      .not.toHaveBeenCalled();
  });
});

describe('initial fallback', () => {
  describe('and delayInitialFallback is false', () => {
    it('fire fallback suggestion after a delay on startup', () => {
      renderComponent({ greeted: true, isInitialSession: true, currentSessionID: 1234, currentScreen: 'conversation' });
      jest.runAllTimers();
      expect(actions.botChannelChoice)
        .toHaveBeenCalledWith('Or you can get in touch.');
      expect(actions.botInitialFallback)
        .toHaveBeenCalled();
    });
  });

  describe('and delayInitialFallback is true', () => {
    it('does not fires fallback', () => {
      renderComponent({
        greeted: true,
        isInitialSession: true,
        currentSessionID: 1234,
        currentScreen: 'conversation',
        delayInitialFallback: true
      });
      jest.runAllTimers();
      expect(actions.botChannelChoice)
        .not.toHaveBeenCalledWith('Or you can get in touch.');
      expect(actions.botInitialFallback)
        .not.toHaveBeenCalled();
    });
  });

  it('does not fire if screen is not conversation screen', () => {
    renderComponent({ greeted: true, isInitialSession: true, currentSessionID: 1234, currentScreen: ARTICLE_SCREEN });
    jest.runAllTimers();
    expect(actions.botInitialFallback)
      .not.toHaveBeenCalled();
  });

  it('does not fire fallback suggestion if it has been fired already', () => {
    renderComponent({
      initialFallbackSuggested: true,
      greeted: true,
      isInitialSession: true,
      currentSessionID: 1234,
      currentScreen: CONVERSATION_SCREEN
    });
    jest.runAllTimers();
    expect(actions.botInitialFallback)
      .not.toHaveBeenCalled();
  });

  it('does not run fallbacks if it was unmounted', () => {
    const { unmount } = renderComponent({
      greeted: true,
      isInitialSession: true,
      currentSessionID: 1234,
      currentScreen: CONVERSATION_SCREEN
    });

    unmount();
    jest.runAllTimers();
    expect(actions.botInitialFallback)
      .not.toHaveBeenCalled();
  });
});

describe('session fallback', () => {
  it('fires fallback suggestion on request rejected', () => {
    renderComponent({
      greeted: true,
      isInitialSession: true,
      currentSessionID: 1234,
      currentScreen: CONVERSATION_SCREEN,
      currentRequestStatus: 'REJECTED'
    });
    expect(actions.sessionFallback)
      .toHaveBeenCalled();
    expect(actions.botChannelChoice)
      .toHaveBeenCalledWith('Would you like to get in touch?', true);
    expect(actions.botMessage)
      .toHaveBeenCalledWith('Or you can ask another question.', expect.any(Function));
  });

  it('fires fallback suggestion if no articles are returned', () => {
    renderComponent({
      greeted: true,
      isInitialSession: true,
      currentSessionID: 1234,
      currentScreen: CONVERSATION_SCREEN,
      currentRequestStatus: 'COMPLETED',
      sessionArticlesLength: 0
    });
    expect(actions.sessionFallback)
      .toHaveBeenCalled();
    expect(actions.botChannelChoice)
      .toHaveBeenCalledWith('Would you like to get in touch?', true);
    expect(actions.botMessage)
      .toHaveBeenCalledWith('Or you can ask another question.', expect.any(Function));
  });

  describe('on request success', () => {
    const renderInitial = (props = {}) => {
      const componentProps = {
        greeted: true,
        isInitialSession: true,
        currentSessionID: 1234,
        currentScreen: CONVERSATION_SCREEN,
        currentRequestStatus: 'COMPLETED',
        sessionArticlesLength: 3
      };

      return renderComponent({
        ...componentProps,
        ...props
      });
    };

    it('fires fallback suggestion after a delay if request is successful', () => {
      renderInitial({ channelAvailable: false });
      expect(actions.sessionFallback)
        .not.toHaveBeenCalled();
      jest.runAllTimers();
      expect(actions.sessionFallback)
        .toHaveBeenCalled();
      expect(actions.botChannelChoice)
        .toHaveBeenCalledWith('You can also get in touch.', false);
      expect(actions.botMessage)
        .toHaveBeenCalledWith('You can ask another question.', expect.any(Function));
    });

    it('displays different message if channels are available', () => {
      renderInitial({ channelAvailable: true });
      jest.runAllTimers();
      expect(actions.botMessage)
        .toHaveBeenCalledWith('Or you can ask another question.', expect.any(Function));
    });

    it('does not run fallback if unmounted', () => {
      const { unmount } = renderInitial();

      unmount();
      jest.runAllTimers();
      expect(actions.sessionFallback)
        .not.toHaveBeenCalled();
    });
  });
});
