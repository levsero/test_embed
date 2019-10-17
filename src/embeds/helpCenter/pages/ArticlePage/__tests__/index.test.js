import React from 'react'
import { render } from '@testing-library/react'

import { http } from 'service/transport/http'
import { ContextProvider } from 'src/util/testHelpers'
import 'jest-styled-components'
import { Component as ArticlePage } from 'src/embeds/helpCenter/pages/ArticlePage'

const performImageSearch = jest.fn(),
  onClick = jest.fn(),
  closeCurrentArticleSpy = jest.fn(),
  handleArticleViewSpy = jest.fn(),
  article1 = { id: 1, title: 'dire straits', body: 'down to the waterline' },
  article2 = { id: 2, title: 'angus', body: 'feed me' },
  articles = [article1, article2],
  addRestrictedImage = jest.fn(),
  goBackSpy = jest.fn()

const renderComponent = inProps => {
  const props = {
    articles,
    addRestrictedImage,
    showOriginalArticleButton: false,
    performImageSearch,
    restrictedImages: {},
    resultsLocale: 'derp',
    title: 'pageTitle',
    isMobile: false,
    hideZendeskLogo: false,
    showNextButton: true,
    onClick,
    handleOriginalArticleClicked: () => {},
    closeCurrentArticle: closeCurrentArticleSpy,
    handleArticleView: handleArticleViewSpy,
    history: { length: 2, goBack: goBackSpy },
    match: { params: { id: article1.id } },
    ...inProps
  }

  return render(
    <ContextProvider>
      <ArticlePage {...props} />
    </ContextProvider>
  )
}

describe('ArticlePage', () => {
  beforeEach(() => {
    http.init({
      zendeskHost: 'dev.zd-dev.com'
    })
  })

  describe('default render', () => {
    it('matches snapshot', () => {
      expect(renderComponent().container).toMatchSnapshot()
    })

    it('renders button', () => {
      expect(renderComponent().getByText('Leave us a message')).toBeInTheDocument()
    })

    it('renders the article', () => {
      const { getByText } = renderComponent()

      expect(getByText(article1.title)).toBeInTheDocument()
      expect(getByText(article1.body)).toBeInTheDocument()
    })

    it('renders page title', () => {
      expect(renderComponent().getByText('pageTitle')).toBeInTheDocument()
    })
  })

  describe('side effects', () => {
    describe('when it renders an article', () => {
      it('dispatches handleArticleView on mount', () => {
        renderComponent()

        expect(handleArticleViewSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('when it closes the article and unmounts', () => {
      it('dispatches closeCurrentArticle', () => {
        const { unmount } = renderComponent()
        unmount()

        expect(closeCurrentArticleSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
