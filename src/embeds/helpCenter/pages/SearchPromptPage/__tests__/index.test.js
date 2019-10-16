import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import createStore from 'src/redux/createStore'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
import { TEST_IDS } from 'src/constants/shared'
import 'jest-styled-components'
import * as utility from 'utility/devices'

import SearchPromptPage, { Component } from '../index'

jest.mock('service/transport')

const renderInitialSearchPage = () => {
  const store = createStore()
  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <SearchPromptPage />
      </MemoryRouter>
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
    hasSearched: false,
    isMobile: false,
    ...props
  }
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Component {...componentProps} />
      </MemoryRouter>
    </Provider>
  )
}

const mockHeader = 'Search our Help Centre'
const placeHolder = 'How can we help?'

describe('SearchPromptPage', () => {
  it('focuses on search field on load', () => {
    const { getByPlaceholderText } = renderInitialSearchPage()
    expect(document.activeElement).toEqual(getByPlaceholderText(placeHolder))
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

  describe('when a search has been previously performed', () => {
    it('redirects and does not render the SearchPromptPage', () => {
      const { queryByText } = renderComponent({ hasSearched: true })

      expect(queryByText(placeHolder)).not.toBeInTheDocument()
    })
  })

  describe('when no search has been previously performed', () => {
    describe('on desktop', () => {
      beforeEach(() => {
        jest.spyOn(utility, 'isMobileBrowser').mockReturnValue(false)
      })

      it('renders a halfling search prompt with no header', () => {
        const { getByPlaceholderText, queryByText } = renderComponent({
          header: mockHeader
        })

        expect(getByPlaceholderText(placeHolder)).toBeInTheDocument()
        expect(queryByText(mockHeader)).not.toBeInTheDocument()
      })
    })

    describe('on mobile', () => {
      beforeEach(() => {
        jest.spyOn(utility, 'isMobileBrowser').mockReturnValue(true)
      })

      it('renders a full screen search prompt with a header', () => {
        const { getByText, getByPlaceholderText } = renderComponent({
          header: mockHeader,
          isMobile: true
        })

        expect(getByText(mockHeader)).toBeInTheDocument()
        expect(getByPlaceholderText(placeHolder)).toBeInTheDocument()
      })
    })
  })
})
