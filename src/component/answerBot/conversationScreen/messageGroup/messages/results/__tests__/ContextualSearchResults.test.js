import { render, fireEvent } from 'react-testing-library'
import React from 'react'

import { Component as Results } from '../ContextualSearchResults'

const actions = Object.freeze({
  screenChanged: jest.fn(),
  articleShown: jest.fn()
})

const articles = [
  {
    id: 123,
    url:
      'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
    title: 'title 123',
    body: '    <div></div><p>to be filled later 123</p>'
  },
  {
    id: 456,
    url:
      'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
    title: 'title 456',
    body: '        <h1>to be filled later 456</h1>'
  }
]

const renderComponent = (props = {}) => {
  const defaultProps = {
    articles,
    actions
  }

  const componentProps = {
    ...defaultProps,
    ...props
  }

  return render(<Results {...componentProps} />)
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

test('triggers expected actions on article click', () => {
  const { getByText } = renderComponent()

  fireEvent.click(getByText('title 123'))
  expect(actions.articleShown).toHaveBeenCalledWith(123)
  expect(actions.screenChanged).toHaveBeenCalledWith('article')
})
