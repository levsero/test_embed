import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'

import SearchResults from '../'
import * as articleshownAction from 'src/embeds/answerBot/actions/root/article-shown'
import * as screenChangedAction from 'src/embeds/answerBot/actions/root/screen-changed'
import * as articleActions from 'src/embeds/answerBot/actions/article/article-viewed'

const sessionID = 1234

const articles = [
  {
    id: 123,
    url:
      'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
    title: 'title 123',
    body: 'to be filled later 123',
    snippet: 'to be filled later 123',
  },
  {
    id: 456,
    url:
      'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
    title: 'title 456',
    body: 'to be filled later 456',
    snippet: 'to be filled later 456',
  },
]

const renderComponent = (props = {}) => {
  const defaultProps = {
    articles,
    sessionID,
  }

  const componentProps = {
    ...defaultProps,
    ...props,
  }

  return render(<SearchResults {...componentProps} />)
}

test('renders the expected elements', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Here are some articles that may help:')).toBeInTheDocument()
  expect(queryByText('title 123')).toBeInTheDocument()
  expect(queryByText('to be filled later 123')).toBeInTheDocument()
  expect(queryByText('title 456')).toBeInTheDocument()
  expect(queryByText('to be filled later 456')).toBeInTheDocument()
})

test('renders expected message when there are no articles', () => {
  const { getByText } = renderComponent({ articles: [] })

  expect(getByText("I couldn't find any relevant articles.")).toBeInTheDocument()
})

test('renders expected message when there is just 1 article', () => {
  const { getByText } = renderComponent({ articles: [articles[0]] })

  expect(getByText('Here is an article that may help:')).toBeInTheDocument()
})

test('triggers expected actions on article click', () => {
  const result = renderComponent()

  jest.spyOn(articleshownAction, 'articleShown').mockImplementation(() => ({
    type: 'lookAMock',
  }))
  jest.spyOn(screenChangedAction, 'screenChanged')
  jest
    .spyOn(articleActions, 'articleViewed')
    .mockImplementation(() => ({ type: 'mockingThisIsAPain' }))

  fireEvent.click(result.getByText('title 123'))

  expect(articleshownAction.articleShown).toHaveBeenCalledWith(sessionID, 123)
  expect(screenChangedAction.screenChanged).toHaveBeenCalledWith('article')
  expect(articleActions.articleViewed).toHaveBeenCalledWith(sessionID, 123)
})
