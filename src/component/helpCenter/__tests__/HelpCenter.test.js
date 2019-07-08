import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { i18n } from 'service/i18n';
import { Component as HelpCenter } from '../HelpCenter';

const renderComponent = (props = {}, renderer) => {
  const componentProps = {
    chatEnabled: false,
    fullscreen: false,
    talkOnline: false,
    isMobile: false,
    previousSearchTerm: '',
    hasContextualSearched: false,
    performSearch: noop,
    performImageSearch: noop,
    searchFailed: false,
    searchLoading: false,
    resultsLocale: '',
    handleOriginalArticleClicked: noop,
    articleViewActive: false,
    restrictedImages: {},
    searchFieldValue: '',
    handleSearchFieldChange: noop,
    handleSearchFieldFocus: noop,
    isContextualSearchPending: false,
    contextualHelpRequestNeeded: false,
    isContextualSearchComplete: false,
    searchPlaceholder: 'How can we help?',
    chatButtonLabel: 'Live chat',
    messageButtonLabel: 'Leave us a message',
    title: 'Help',
    contactButtonLabel: 'Contact us',
    chatConnecting: false,
    isOnInitialDesktopSearchScreen: false,
    ...props
  };
  const component = <HelpCenter {...componentProps} />;

  if (renderer) {
    return renderer(component);
  } else {
    return render(component);
  }
};

const articles = [
  {
    title: 'First article',
    html_url: 'https://first.article', // eslint-disable-line camelcase
    name: 'hello',
    body: 'world',
    id: 123
  },
  {
    title: 'Second article',
    html_url: 'https://second.article', // eslint-disable-line camelcase
    name: 'foo',
    body: 'bar',
    id: 456
  }
];

test('renders expected classes in desktop', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

test('renders results component when hasSearched is true', () => {
  const { queryByText } = renderComponent({ previousSearchTerm: 'blah', hasSearched: true });

  expect(queryByText('There are no results for "blah"'))
    .toBeInTheDocument();
});

test('hide zendesk logo when hideZendeskLogo is true', () => {
  const { queryByTestId }  = renderComponent({ hideZendeskLogo: true });

  expect(queryByTestId('Icon--zendesk'))
    .not.toBeInTheDocument();
});

test('calls onNextClick on click of button', () => {
  const onNextClick = jest.fn();
  const { getByText } = renderComponent({ onNextClick });

  fireEvent.click(getByText('Leave us a message'));
  expect(onNextClick)
    .toHaveBeenCalled();
});

describe('on article click', () => {
  it('calls handleArticleClick with the article', () => {
    const handleArticleClick = jest.fn();
    const { getByText } = renderComponent({ handleArticleClick, hasSearched: true, articles });

    fireEvent.click(getByText('Second article'));
    expect(handleArticleClick)
      .toHaveBeenCalledWith(articles[1]);

    fireEvent.click(getByText('First article'));
    expect(handleArticleClick)
      .toHaveBeenCalledWith(articles[0]);
  });

  it('calls showBackButton', () => {
    const showBackButton = jest.fn();
    const { getByText } = renderComponent({ showBackButton, hasSearched: true, articles });

    fireEvent.click(getByText('Second article'));
    expect(showBackButton)
      .toHaveBeenCalled();
  });
});

describe('mobile', () => {
  test('renders mobile classes', () => {
    const { container } = renderComponent({ isMobile: true });

    expect(container)
      .toMatchSnapshot();
  });

  it('does not show intro screen when there are articles', () => {
    const { queryByText, rerender } = renderComponent({
      isMobile: true,
      articles: []
    });

    expect(queryByText('Do you have a specific question?'))
      .toBeInTheDocument();
    renderComponent({ isMobile: true, articles: ['hello', 'world'] }, rerender);
    expect(queryByText('Do you have a specific question?'))
      .not.toBeInTheDocument();
  });

  it('calls onNextClick on click of button', () => {
    const onNextClick = jest.fn();
    const { getByText } = renderComponent({ isMobile: true, onNextClick });

    fireEvent.click(getByText('Leave us a message'));
    expect(onNextClick)
      .toHaveBeenCalled();
  });

  it('hides zendesk logo when hideZendeskLogo is true', () => {
    const { queryByTestId }  = renderComponent({ isMobile: true, hideZendeskLogo: true });

    expect(queryByTestId('Icon--zendesk'))
      .not.toBeInTheDocument();
  });
});

describe('help center button', () => {
  describe('when chat is available', () => {
    describe('when channel choice is off', () => {
      it('uses the chat label when there are no notifications', () => {
        const { queryByText } = renderComponent({
          chatAvailable: true,
          chatButtonLabel: 'chat button',
          channelChoice: false
        });

        expect(queryByText('chat button'))
          .toBeInTheDocument();
      });

      it('uses the expected label when there is 1 notification', () => {
        const { queryByText } = renderComponent({
          chatAvailable: true,
          chatNotificationCount: 1,
          chatButtonLabel: 'chat button',
          channelChoice: false
        });

        expect(queryByText('1 new message'))
          .toBeInTheDocument();
      });

      it('uses the expected label when there is more than 1 notification', () => {
        const { queryByText } = renderComponent({
          chatAvailable: true,
          chatNotificationCount: 3,
          channelChoice: false
        });

        expect(queryByText('3 new messages'))
          .toBeInTheDocument();
      });
    });

    describe('when channel choice is on', () => {
      it('uses contact button label', () => {
        const { queryByText } = renderComponent({
          chatAvailable: true,
          messageButtonLabel: 'message button',
          contactButtonLabel: 'this is the contact button',
          channelChoice: true
        });

        expect(queryByText('this is the contact button'))
          .toBeInTheDocument();
      });
    });

    describe('when chat is offline but offline form is enabled', () => {
      it('uses the message button label', () => {
        const { queryByText } = renderComponent({
          chatAvailable: true,
          messageButtonLabel: 'message button',
          chatOfflineAvailable: true,
          channelChoice: false
        });

        expect(queryByText('message button'))
          .toBeInTheDocument();
      });
    });
  });

  describe('when talk is online', () => {
    describe('when callback is enabled', () => {
      it('uses the callback label', () => {
        const { queryByText } = renderComponent({
          talkOnline: true,
          callbackEnabled: true
        });

        expect(queryByText('Request a callback'))
          .toBeInTheDocument();
      });
    });

    describe('when callback is disabled', () => {
      it('uses the callback label', () => {
        const { queryByText } = renderComponent({
          talkOnline: true,
          callbackEnabled: false
        });

        expect(queryByText('Call us'))
          .toBeInTheDocument();
      });
    });
  });
});

describe('searching', () => {
  const search = (query, renderProps = {}) => {
    const performSearch = jest.fn();
    const utils = renderComponent({ performSearch, ...renderProps });
    const input = utils.getByPlaceholderText('How can we help?');

    fireEvent.change(input, { target: { value: query } });
    fireEvent.submit(input);

    return { performSearch, ...utils } ;
  };
  const error = { ok: false, body: {} };
  const success = { ok: true, body: { results: articles, count: 3 } };
  const noResultsFound = { ok: true, body: { results: [], count: 0 } };
  const successFn = (fn, idx = 0) => fn.mock.calls[idx][1];
  const failFn = (fn, idx = 0) => fn.mock.calls[idx][2];

  beforeEach(() => {
    jest.spyOn(i18n, 'getLocale').mockReturnValue('en-AU');
  });

  it('does not call performSearch when there is no search query', () => {
    const { performSearch } = search('');

    expect(performSearch)
      .not.toHaveBeenCalled();
  });

  it('calls performSearch with the expected arguments', () => {
    const { performSearch } = search('Help me');

    expect(performSearch)
      .toHaveBeenCalledWith({
        locale: 'en-AU',
        origin: 'web_widget',
        per_page: 9, // eslint-disable-line camelcase
        query: 'Help me'
      }, expect.any(Function), expect.any(Function));
  });

  it('calls showBackButton on success', () => {
    const showBackButton = jest.fn();
    const { performSearch } = search('Help me', { showBackButton });

    successFn(performSearch)(success);
    expect(showBackButton)
      .toHaveBeenCalledWith(false);
  });

  it('focuses on search field when result is an error', () => {
    const { performSearch, getByTestId } = search('Help me');

    failFn(performSearch)(error);
    expect(getByTestId('Icon--search'))
      .toHaveClass('focused');
  });

  it('falls back to no locale when frst search returns no results', () => {
    const { performSearch } = search('Help me');

    expect(performSearch)
      .toHaveBeenCalledWith({
        locale: 'en-AU',
        origin: 'web_widget',
        per_page: 9, // eslint-disable-line camelcase
        query: 'Help me'
      }, expect.any(Function), expect.any(Function));

    successFn(performSearch)(noResultsFound);

    expect(performSearch)
      .toHaveBeenCalledWith({
        locale: '',
        origin: 'web_widget',
        per_page: 9, // eslint-disable-line camelcase
        query: 'Help me'
      }, expect.any(Function), expect.any(Function));
  });

  it('falls back to the fallback url when search returns no results', () => {
    const { performSearch } = search('Help me', { localeFallbacks: ['fr', 'es'] });

    expect(performSearch)
      .toHaveBeenCalledWith({
        locale: 'en-AU',
        origin: 'web_widget',
        per_page: 9, // eslint-disable-line camelcase
        query: 'Help me'
      }, expect.any(Function), expect.any(Function));

    successFn(performSearch)(noResultsFound);

    expect(performSearch)
      .toHaveBeenCalledWith({
        locale: 'fr',
        origin: 'web_widget',
        per_page: 9, // eslint-disable-line camelcase
        query: 'Help me'
      }, expect.any(Function), expect.any(Function));

    successFn(performSearch)(noResultsFound);

    expect(performSearch)
      .toHaveBeenCalledWith({
        locale: 'es',
        origin: 'web_widget',
        per_page: 9, // eslint-disable-line camelcase
        query: 'Help me'
      }, expect.any(Function), expect.any(Function));
  });
});