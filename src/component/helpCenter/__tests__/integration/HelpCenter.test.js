import { render, fireEvent } from 'react-testing-library';
import React from 'react';
import { Provider } from 'react-redux';

import createStore from 'src/redux/createStore';
import { http } from 'service/transport';

import {
  updateEmbedAccessible,
  updateActiveEmbed
} from 'src/redux/modules/base';

import HelpCenter from '../../HelpCenter';

const renderComponent = (newProps = {}) => {
  const props = {
    chatOfflineAvailable: false,
    chatEnabled: false,
    talkOnline: false,
    hideZendeskLogo: false,
    onNextClick: noop,
    showNextButton: false,
    fullscreen: false,
    originalArticleButton: false,
    channelChoice: false,
    callbackEnabled: false,
    submitTicketAvailable: false,
    chatAvailable: false,
    isMobile: false,
    ...newProps
  };
  const store = createStore();

  setupMocks();

  store.dispatch(updateEmbedAccessible('helpCenterForm', true));
  store.dispatch(updateActiveEmbed('helpCenterForm'));

  return render(<Provider store={store}><HelpCenter {...props} /></Provider>);
};

const search = jest.fn((options) => {
  /* eslint-disable camelcase */
  options.callbacks.done({
    body: {
      results: [
        {
          id: 115002343711,
          url: 'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343711-Welcome-to-your-Help-Center-.json',
          html_url: 'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343711-Welcome-to-your-Help-Center-',
          author_id: 115806148031,
          comments_disabled: false,
          label_names: [],
          draft: false,
          promoted: false,
          position: 0,
          vote_sum: 0,
          vote_count: 0,
          section_id: 115000610611,
          created_at: '2017-10-23T23:27:18Z',
          updated_at: '2017-10-23T23:27:18Z',
          edited_at: '2017-10-23T23:27:18Z',
          name: 'Welcome to your Help Center!',
          title: 'Welcome to your Help Center!',
          body: '<p>this is the first article</p>',
          source_locale: 'en-us',
          locale: 'en-us',
          outdated: false,
          outdated_locales: [],
          permission_group_id: 617232,
          user_segment_id: null,
          result_type: 'article'
        },
        {
          id: 115002343791,
          url: 'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343791-How-can-agents-leverage-knowledge-to-help-customers-.json',
          html_url: 'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343791-How-can-agents-leverage-knowledge-to-help-customers-',
          author_id: 115806148031,
          comments_disabled: false,
          label_names: [],
          draft: false,
          promoted: false,
          position: 0,
          vote_sum: 0,
          vote_count: 0,
          section_id: 115000610631,
          created_at: '2017-10-23T23:27:19Z',
          updated_at: '2017-10-23T23:27:19Z',
          edited_at: '2017-10-23T23:27:19Z',
          name: 'How can agents leverage knowledge to help customers?',
          title: 'How can agents leverage knowledge to help customers?',
          body: '<p>this is the second article</p>',
          source_locale: 'en-us',
          locale: 'en-us',
          outdated: false,
          outdated_locales: [],
          permission_group_id: 617232,
          user_segment_id: null,
          result_type: 'article'
        },
        {
          id: 115002343751,
          url: 'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343751-How-do-I-customize-my-Help-Center-.json',
          html_url: 'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343751-How-do-I-customize-my-Help-Center-',
          author_id: 115806148031,
          comments_disabled: false,
          label_names: [],
          draft: false,
          promoted: false,
          position: 0,
          vote_sum: 0,
          vote_count: 0,
          section_id: 115000610631,
          created_at: '2017-10-23T23:27:19Z',
          updated_at: '2017-10-23T23:27:19Z',
          edited_at: '2017-10-23T23:27:19Z',
          name: 'How do I customize my Help Center?',
          title: 'How do I customize my Help Center?',
          body: '<p>this is the third article</p>',
          source_locale: 'en-us',
          locale: 'en-us',
          outdated: false,
          outdated_locales: [],
          permission_group_id: 617232,
          user_segment_id: null,
          result_type: 'article'
        },
        {
          id: 115002343731,
          url: 'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343731-What-are-these-sections-and-articles-doing-here-.json',
          html_url: 'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343731-What-are-these-sections-and-articles-doing-here-',
          author_id: 115806148031,
          comments_disabled: false,
          label_names: [],
          draft: false,
          promoted: false,
          position: 0,
          vote_sum: 0,
          vote_count: 0,
          section_id: 115000610631,
          created_at: '2017-10-23T23:27:18Z',
          updated_at: '2017-10-23T23:27:18Z',
          edited_at: '2017-10-23T23:27:18Z',
          name: 'What are these sections and articles doing here?',
          title: 'What are these sections and articles doing here?',
          body: '<p>this is the third article</p>',
          source_locale: 'en-us',
          locale: 'en-us',
          outdated: false,
          outdated_locales: [],
          permission_group_id: 617232,
          user_segment_id: null,
          result_type: 'article'
        },
        {
          id: 115002343771,
          url: 'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343771-How-do-I-publish-my-content-in-other-languages-.json',
          html_url: 'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343771-How-do-I-publish-my-content-in-other-languages-',
          author_id: 115806148031,
          comments_disabled: false,
          label_names: [],
          draft: false,
          promoted: false,
          position: 0,
          vote_sum: 0,
          vote_count: 0,
          section_id: 115000610631,
          created_at: '2017-10-23T23:27:19Z',
          updated_at: '2018-09-03T07:12:33Z',
          edited_at: '2018-09-03T07:12:33Z',
          name: 'How do I publish my content in other languages?',
          title: 'How do I publish my content in other languages?',
          body: '<p>this  is the fourth article</p>',
          source_locale: 'en-us',
          locale: 'en-us',
          outdated: false,
          outdated_locales: [],
          permission_group_id: 617232,
          user_segment_id: null,
          result_type: 'article'
        }
      ],
      page: 1,
      previous_page: null,
      next_page: null,
      per_page: 9,
      page_count: 1,
      count: 5
    }
  });
  /* eslint-enable camelcase */
});

const setupMocks = () => {
  http.init({
    zendeskHost: 'dev.zd-dev.com',
    version: 'v1'
  });

  http.send = (options) => {
    switch (options.path) {
      case '/api/v2/help_center/search.json':
        search(options);
        break;
      default:
        throw `Unrecognized http request received! Params are ${options}`;
    }
  };
};

const checkArticlesDisplayed = (queryByText) => {
  expect(queryByText('How can agents leverage knowledge to help customers?'))
    .toBeInTheDocument();
  expect(queryByText('How do I customize my Help Center?'))
    .toBeInTheDocument();
  expect(queryByText('What are these sections and articles doing here?'))
    .toBeInTheDocument();
  expect(queryByText('How do I publish my content in other languages?'))
    .toBeInTheDocument();
};

describe('desktop', () => {
  const checkContainerSize = (container, height) => {
    expect(container).toHaveStyle(`height: ${height};`);
  };

  test('integration', () => {
    const { container, getByTestId, getByPlaceholderText, queryByText } = renderComponent();
    const scrollContainer = getByTestId('scrollcontainer');

    // initially, the component is sized 150px
    checkContainerSize(scrollContainer, 150);

    const form = container.querySelector('form');
    const input = getByPlaceholderText('How can we help?');

    fireEvent.change(input, { target: { value: 'Help me' } });
    fireEvent.submit(form);

    // after searching, the component should expand to 550px
    checkContainerSize(scrollContainer, 550);

    // displays the articles
    checkArticlesDisplayed(queryByText);

    fireEvent.click(queryByText('What are these sections and articles doing here?'));

    expect(queryByText('this is the third article'))
      .toBeInTheDocument();
  });
});

describe('mobile', () => {
  test('integration', () => {
    const { container, queryByText, getByPlaceholderText } = renderComponent({ isMobile: true });

    expect(queryByText('Search our Help Center'))
      .toBeInTheDocument();

    const form = container.querySelector('form');
    const input = getByPlaceholderText('How can we help?');

    fireEvent.change(input, { target: { value: 'Help me' } });
    fireEvent.submit(form);

    checkArticlesDisplayed(queryByText);

    fireEvent.click(queryByText('How can agents leverage knowledge to help customers?'));

    expect(queryByText('this is the second article'))
      .toBeInTheDocument();
  });
});
