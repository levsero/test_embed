import { Component as ArticlePage } from 'src/embeds/helpCenter/pages/ArticlePage'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'

const performImageSearch = jest.fn(),
  handleOriginalArticleClicked = jest.fn(),
  onClick = jest.fn()

const renderComponent = inProps => {
  const props = {
    buttonLabel: 'buttonLabel',
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

  it('renders button label', () => {
    expect(renderComponent().getByText('buttonLabel')).toBeInTheDocument()
  })

  it('renders the article', () => {
    expect(renderComponent().getByText('articleTitle')).toBeInTheDocument()
  })

  it('renders page title', () => {
    expect(renderComponent().getByText('pageTitle')).toBeInTheDocument()
  })

  it('renders zendesk logo', () => {
    expect(renderComponent().container).toMatchSnapshot()
  })
})

describe('when hiding zendeskLogo', () => {
  it('does not render the zendesk logo', () => {
    const result = renderComponent({ hideZendeskLogo: true })
    expect(result.queryByText('ZendeskLogo')).toBeNull()
  })
})

describe('button', () => {
  it('onClick', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('buttonLabel'))
    expect(onClick).toHaveBeenCalled()

    onClick.mockReset()
  })

  describe('when disabled', () => {
    it('does not render', () => {
      const { queryByText } = renderComponent({ showNextButton: false })

      expect(queryByText('buttonLabel')).toBeNull()
    })
  })
})
