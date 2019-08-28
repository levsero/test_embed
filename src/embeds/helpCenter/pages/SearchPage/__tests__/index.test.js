import { Component as SearchPage } from '../index'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'

const articles = [
  {
    title: 'First article',
    html_url: 'https://first.article', // eslint-disable-line camelcase
    name: 'hello',
    body: 'world',
    id: 123
  },
  {
    title: 'Second article',
    html_url: 'https://second.article', // eslint-disable-line camelcase
    name: 'foo',
    body: 'bar',
    id: 456
  }
]

const renderComponent = inProps => {
  const props = {
    activeArticle: { title: 'articleTitle' },
    originalArticleButton: false,
    updateBackButtonVisibility: noop,
    handleArticleClick: noop,
    restrictedImages: {},
    resultsLocale: 'derp',
    title: 'pageTitle',
    isMobile: false,
    hasContextualSearched: false,
    isContextualSearchComplete: false,
    hideZendeskLogo: false,
    loading: false,
    showNextButton: true,
    articles,
    ...inProps
  }

  return render(
    <Provider store={createStore()}>
      <SearchPage {...props} />
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

  it('renders the results', () => {
    expect(renderComponent().getByText('Top results')).toBeInTheDocument()
  })

  it('renders page title', () => {
    expect(renderComponent().getByText('pageTitle')).toBeInTheDocument()
  })
})

describe('on article click', () => {
  it('calls handleArticleClick with the correct article', () => {
    const handleArticleClick = jest.fn()
    const { getByText } = renderComponent({
      handleArticleClick,
      hasSearched: true,
      articleViewActive: false
    })

    fireEvent.click(getByText('Second article'))
    expect(handleArticleClick).toHaveBeenCalledWith(articles[1])

    fireEvent.click(getByText('First article'))
    expect(handleArticleClick).toHaveBeenCalledWith(articles[0])
  })

  it('calls updateBackButtonVisibility', () => {
    const updateBackButtonVisibility = jest.fn()
    const { getByText } = renderComponent({
      updateBackButtonVisibility,
      hasSearched: true,
      articles
    })

    fireEvent.click(getByText('Second article'))
    expect(updateBackButtonVisibility).toHaveBeenCalled()
  })
})
