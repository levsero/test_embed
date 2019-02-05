import 'utility/i18nTestHelper';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { Component as Results } from '../index';

const actions = Object.freeze({
  screenChanged: jest.fn(),
  articleShown: jest.fn(),
  articleViewed: jest.fn()
});

const sessionID = 1234;

const articles = [
  {
    id: 123,
    url: 'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
    title: 'title 123',
    body: 'to be filled later 123',
    snippet: 'to be filled later 123'
  },
  {
    id: 456,
    url: 'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
    title: 'title 456',
    body: 'to be filled later 456',
    snippet: 'to be filled later 456'
  }
];

const renderComponent = (props = {}) => {
  const defaultProps = {
    articles,
    sessionID,
    actions
  };

  const componentProps = {
    ...defaultProps,
    ...props
  };

  return render(<Results {...componentProps} />);
};

test('renders the expected classes', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

test('renders expected message when there are no articles', () => {
  const { getByText } = renderComponent({ articles: [] });

  expect(getByText("I couldn't find any relevant articles."))
    .toBeInTheDocument();
});

test('renders expected message when there is just 1 article', () => {
  const { getByText } = renderComponent({ articles: [articles[0]] });

  expect(getByText('Here is an article that may help:'))
    .toBeInTheDocument();
});

test('triggers expected actions on article click', () => {
  const { getByText } = renderComponent();

  fireEvent.click(getByText('title 123'));
  expect(actions.articleShown)
    .toHaveBeenCalledWith(sessionID, 123);
  expect(actions.screenChanged)
    .toHaveBeenCalledWith('article');
  expect(actions.articleViewed)
    .toHaveBeenCalledWith(sessionID, 123);
});
