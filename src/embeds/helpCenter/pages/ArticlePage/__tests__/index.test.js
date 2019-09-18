import { Component as ArticlePage } from 'src/embeds/helpCenter/pages/ArticlePage'
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import 'jest-styled-components'

const performImageSearch = jest.fn(),
  handleOriginalArticleClicked = jest.fn(),
  onClick = jest.fn()

const renderComponent = inProps => {
  const props = {
    activeArticle: { title: 'articleTitle' },
    originalArticleButton: false,
    performImageSearch,
    handleOriginalArticleClicked,
    restrictedImages: {},
    resultsLocale: 'derp',
    title: 'pageTitle',
    isMobile: false,
    hideZendeskLogo: false,
    loading: false,
    showNextButton: true,
    onClick,
    ...inProps
  }

  return render(
    <Provider store={createStore()}>
      <ArticlePage {...props} />
    </Provider>
  )
}

describe('default render', () => {
  it('matches snapshot', () => {
    expect(renderComponent().container).toMatchSnapshot()
  })

  it('renders button', () => {
    expect(renderComponent().getByText('Leave us a message')).toBeInTheDocument()
  })

  it('renders the article', () => {
    expect(renderComponent().getByText('articleTitle')).toBeInTheDocument()
  })

  it('renders page title', () => {
    expect(renderComponent().getByText('pageTitle')).toBeInTheDocument()
  })
})
