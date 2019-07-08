import { render } from 'react-testing-library';
import React from 'react';

import createStore from 'src/redux/createStore';
import { Provider } from 'react-redux';

import * as rootSelectors from 'src/redux/modules/answerBot/root/selectors';
import { http } from 'service/transport';

import { ARTICLE_SCREEN, CONVERSATION_SCREEN } from 'src/constants/answerBot';
import { Component as AnswerBot } from '../index';

const renderComponent = (props = {}) => {
  const store = createStore();
  const componentProps = {
    title: 'Answer Bot',
    lastConversationScroll: 0,
    currentScreen: CONVERSATION_SCREEN,
    actions: {
      updateBackButtonVisibility: noop,
      conversationScrollChanged: noop
    },
    ...props
  };

  return render(
    <Provider store={store}>
      <AnswerBot {...componentProps} />
    </Provider>
  );
};

describe('conversation screen', () => {
  it('renders expected components and styles in desktop', () => {
    const { container } = renderComponent();

    expect(container)
      .toMatchSnapshot();
  });

  it('renders expected components and styles in mobile', () => {
    const { container } = renderComponent({
      isMobile: true
    });

    expect(container)
      .toMatchSnapshot();
  });

  it('hides zendesk logo', () => {
    const { container } = renderComponent({
      hideZendeskLogo: true
    });

    expect(container.querySelector('.Icon--zendesk'))
      .not.toBeInTheDocument();
  });
});

describe('article screen', () => {
  beforeEach(() => {
    jest.spyOn(http, 'getDynamicHostname').mockReturnValue('a.b.c');
    jest.spyOn(rootSelectors, 'getCurrentArticle').mockReturnValue({
      title: 'help',
      body: 'here'
    });
  });

  test('renders expected components and styles in desktop', () => {
    const { container } = renderComponent({
      currentScreen: ARTICLE_SCREEN
    });

    expect(container)
      .toMatchSnapshot();
  });

  test('renders expected components and styles in mobile', () => {
    const { container } = renderComponent({
      currentScreen: ARTICLE_SCREEN,
      isMobile: true
    });

    expect(container)
      .toMatchSnapshot();
  });
});
