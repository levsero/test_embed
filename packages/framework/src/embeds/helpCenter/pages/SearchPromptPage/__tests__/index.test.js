import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'src/constants/shared'
import { getSearchLoading } from 'src/embeds/helpCenter/selectors'
import { http } from 'src/service/transport'
import { render } from 'utility/testHelpers'
import SearchPromptPage, { Component } from '../index'

http.get = jest.fn(
  () =>
    new Promise((resolve) => {
      resolve()
    })
)

const placeHolder = 'How can we help?'

const renderInitialSearchPage = () => {
  const utils = render(<SearchPromptPage />)
  const inputNode = utils.getByPlaceholderText(placeHolder)
  const formNode = utils.container.querySelector('form')

  return { ...utils, inputNode, formNode }
}

const renderComponent = (props) => {
  const componentProps = {
    title: 'title',
    hasSearched: false,
    ...props,
  }
  return render(<Component {...componentProps} />)
}

describe('SearchPromptPage', () => {
  it('focuses on search field on load', () => {
    const { inputNode } = renderInitialSearchPage()
    expect(document.activeElement).toEqual(inputNode)
  })

  it('searches when text provided', () => {
    const { inputNode, formNode, store } = renderInitialSearchPage()

    expect(getSearchLoading(store.getState())).toEqual(false)
    fireEvent.change(inputNode, { target: { value: 'help me!' } })
    fireEvent.submit(formNode)
    expect(getSearchLoading(store.getState())).toEqual(true)
  })

  it('renders the footer', () => {
    const { queryByTestId } = renderComponent()

    expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).toBeInTheDocument()
  })

  describe('when a search has been previously performed', () => {
    it('redirects and does not render the SearchPromptPage', () => {
      const { queryByText } = renderComponent({ hasSearched: true })

      expect(queryByText(placeHolder)).not.toBeInTheDocument()
    })
  })
})
