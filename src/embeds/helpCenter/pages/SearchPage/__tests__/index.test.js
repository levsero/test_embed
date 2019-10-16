import React from 'react'
import { render } from '@testing-library/react'
import 'jest-styled-components'

import { Component as SearchPage } from '../index'
import { ContextProvider } from 'src/util/testHelpers'

const renderComponent = inProps => {
  const props = {
    title: 'pageTitle',
    isMobile: false,
    isContextualSearchPending: false,
    hideZendeskLogo: false,
    showNextButton: true,
    articles: [],
    ...inProps
  }

  return render(
    <ContextProvider>
      <SearchPage {...props} />
    </ContextProvider>
  )
}

describe('render', () => {
  describe('when not isContextualSearchPending', () => {
    it('matches snapshot, renders NoResults', () => {
      expect(renderComponent().container).toMatchSnapshot()
    })
  })

  describe('when isContextualSearchPending', () => {
    it('matches snapshot, renders LoadingBarContent', () => {
      const result = renderComponent({ isContextualSearchPending: true })
      expect(result.container).toMatchSnapshot()
    })
  })

  it('renders button', () => {
    expect(renderComponent().getByText('Leave us a message')).toBeInTheDocument()
  })

  it('renders page title', () => {
    expect(renderComponent().getByText('pageTitle')).toBeInTheDocument()
  })

  describe('no results', () => {
    it('focuses on search field', () => {
      const { getByPlaceholderText } = renderComponent({ articles: [] })
      expect(document.activeElement).toEqual(getByPlaceholderText('How can we help?'))
    })
  })
})
