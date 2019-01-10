import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';

import { PureAnswerBotContainer as AnswerBotContainer } from '../AnswerBotContainer';

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
  botFeedbackMessage: jest.fn()
});

const renderComponent = (props = {}, renderFn) => {
  const defaultProps = {
    sessions: {},
    currentSessionResolved: false,
    sessionFallbackSuggested: false,
    sessionArticlesLength: 0,
    currentScreen: 'conversation',
    currentMessage: 'current message',
    isInitialSession: true,
    greeted: false,
    initialFallbackSuggested: false,
    isFeedbackRequired: false,
    actions
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
    const { rerender } = renderComponent({ saveConversationScroll: handler, currentScreen: 'conversation' });

    renderComponent({ currentScreen: 'article' }, rerender);
    expect(handler)
      .toHaveBeenCalled();
  });

  it('restores scroll position when we go from article to conversation', () => {
    const handler = jest.fn();
    const { rerender } = renderComponent({ restoreConversationScroll: handler, currentScreen: 'article' });

    renderComponent({ currentScreen: 'conversation' }, rerender);
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
    renderComponent({ currentSessionID: 1234, isInitialSession: true, currentScreen: 'article' });

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
});

describe('in-conversation feedback', () => {
  it('shows after going from article to conversation and feedback is required', () => {
    const { rerender } = renderComponent({ currentSessionID: 1234, currentScreen: 'article' });

    renderComponent({ currentSessionID: 1234, currentScreen: 'conversation', isFeedbackRequired: true }, rerender);

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
    const { rerender } = renderComponent({ currentSessionID: 1234, currentScreen: 'article' });

    renderComponent({ currentSessionID: 1234, currentScreen: 'article', isFeedbackRequired: true }, rerender);

    expect(actions.botFeedbackRequested)
      .not.toHaveBeenCalled();
  });

  it('does not show the feedback if feedback is not required', () => {
    const { rerender } = renderComponent({ currentSessionID: 1234, currentScreen: 'article' });

    renderComponent({ currentSessionID: 1234, currentScreen: 'conversation', isFeedbackRequired: false }, rerender);

    expect(actions.botFeedbackRequested)
      .not.toHaveBeenCalled();
  });
});

describe('initial fallback', () => {
  it('fires fallback suggestion after a delay on startup', () => {
    renderComponent({ greeted: true, isInitialSession: true, currentSessionID: 1234, currentScreen: 'conversation' });
    jest.runAllTimers();
    expect(actions.botChannelChoice)
      .toHaveBeenCalledWith('Or you can get in touch.');
    expect(actions.botInitialFallback)
      .toHaveBeenCalled();
  });

  it('does not fire if screen is not conversation screen', () => {
    renderComponent({ greeted: true, isInitialSession: true, currentSessionID: 1234, currentScreen: 'article' });
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
      currentScreen: 'conversation'
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
      currentScreen: 'conversation'
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
      currentScreen: 'conversation',
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
      currentScreen: 'conversation',
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
        currentScreen: 'conversation',
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
