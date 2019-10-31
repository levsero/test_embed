import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'utility/testHelpers'
import { getSearchLoading } from 'embeds/helpCenter/selectors'
import SearchPromptPage, { Component } from '../index'
import { TEST_IDS } from 'src/constants/shared'
import 'jest-styled-components'

jest.mock('service/transport')

const renderInitialSearchPage = () => {
  const utils = render(<SearchPromptPage />)
  const inputNode = utils.getByPlaceholderText('How can we help?')
  const formNode = utils.container.querySelector('form')

  return { ...utils, inputNode, formNode }
}

const renderComponent = props => {
  const componentProps = {
    title: 'title',
    ...props
  }
  return render(<Component {...componentProps} />)
}

describe('SearchPromptPage', () => {
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

  it('renders the footer', () => {
    const { queryByTestId } = renderComponent()

    expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).toBeInTheDocument()
  })
})
