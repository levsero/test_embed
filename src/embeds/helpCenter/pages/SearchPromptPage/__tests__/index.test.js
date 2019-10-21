import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'

import createStore from 'src/redux/createStore'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
import SearchPromptPage, { Component } from '../index'
import { TEST_IDS } from 'src/constants/shared'
import 'jest-styled-components'

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

const renderComponent = props => {
  const store = createStore()
  const componentProps = {
    title: 'title',
    hideZendeskLogo: false,
    ...props
  }
  return render(
    <Provider store={store}>
      <Component {...componentProps} />
    </Provider>
  )
}

it('renders the full page', () => {
  const { container } = renderInitialSearchPage()

  expect(container.firstChild).toMatchSnapshot()
})

it('focuses on search field on load', () => {
  const { getByPlaceholderText } = renderInitialSearchPage()
  expect(document.activeElement).toEqual(getByPlaceholderText('How can we help?'))
})

it('searches when text provided', () => {
  const { inputNode, formNode, store } = renderInitialSearchPage()

  expect(getSearchLoading(store.getState())).toEqual(false)
  fireEvent.change(inputNode, { target: { value: 'help me!' } })
  fireEvent.submit(formNode)
  expect(getSearchLoading(store.getState())).toEqual(true)
})

it('hides the footer when requested', () => {
  const { queryByTestId } = renderComponent({ hideZendeskLogo: true })

  expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).not.toBeInTheDocument()
})

it('renders the header when in mobile', () => {
  const { queryByText } = renderComponent({ header: 'this is my header', isMobile: true })

  expect(queryByText('this is my header')).toBeInTheDocument()
})

it('does not render the header when in desktop', () => {
  const { queryByText } = renderComponent({ header: 'this is my header', isMobile: false })

  expect(queryByText('this is my header')).not.toBeInTheDocument()
})
