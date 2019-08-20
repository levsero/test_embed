import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
import * as selectors from 'src/redux/modules/selectors/selectors'
import SearchPromptPage from '../index'

jest.mock('service/transport')

const renderInitialSearchPage = () => {
  const store = createStore()
  const utils = render(
    <Provider store={store}>
      <SearchPromptPage />
    </Provider>
  )

  const inputNode = utils.getByPlaceholderText('How can we help?')
  const formNode = utils.container.querySelector('form')

  return { ...utils, inputNode, formNode, store }
}

it('renders the full page', () => {
  const { container } = renderInitialSearchPage()

  expect(container.firstChild).toMatchSnapshot()
})

it('searches when text provided', () => {
  const { inputNode, formNode, store } = renderInitialSearchPage()

  expect(getSearchLoading(store.getState())).toEqual(false)
  fireEvent.change(inputNode, { target: { value: 'help me!' } })
  fireEvent.submit(formNode)
  expect(getSearchLoading(store.getState())).toEqual(true)
})

it('hides the footer when requested', () => {
  jest.spyOn(selectors, 'getHideZendeskLogo').mockReturnValue(true)
  const { queryByTestId } = renderInitialSearchPage()

  expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
})
