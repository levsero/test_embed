import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'

import { dispatchUpdateEmbeddableConfig } from 'utility/testHelpers'
import { i18n } from 'service/i18n'
import * as utility from 'utility/devices'
import createStore from 'src/redux/createStore'
import { Component as HelpCenter } from '../HelpCenter'

jest.mock('src/embeds/helpCenter/pages/ArticlePage', () => () => <div>ArticlePage</div>)

const renderComponent = (props = {}) => {
  const componentProps = {
    chatEnabled: false,
    fullscreen: false,
    talkOnline: false,
    isMobile: false,
    previousSearchTerm: '',
    hasContextualSearched: false,
    performSearch: noop,
    performImageSearch: noop,
    searchFailed: false,
    searchLoading: false,
    resultsLocale: '',
    handleOriginalArticleClicked: noop,
    articleViewActive: false,
    restrictedImages: {},
    searchFieldValue: '',
    handleSearchFieldChange: noop,
    handleSearchFieldFocus: noop,
    isContextualSearchPending: false,
    contextualHelpRequestNeeded: false,
    isContextualSearchComplete: false,
    searchPlaceholder: 'How can we help?',
    title: 'Help',
    chatConnecting: false,
    isOnInitialDesktopSearchScreen: false,
    ...props
  }
  const store = createStore()
  const component = (
    <Provider store={store}>
      <HelpCenter {...componentProps} />
    </Provider>
  )

  return { store, ...render(component) }
}

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

test('renders expected classes in desktop', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

test('renders search page when hasSearched is true', () => {
  const { queryByText } = renderComponent({
    hasSearched: true
  })

  expect(queryByText('There are no results for ""')).toBeInTheDocument()
})

test('hide zendesk logo when hideZendeskLogo is true', () => {
  const { queryByTestId } = renderComponent({ hideZendeskLogo: true })

  expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
})

describe('mobile', () => {
  beforeEach(() => {
    jest.spyOn(utility, 'isMobileBrowser').mockReturnValue(true)
  })

  test('renders mobile classes', () => {
    const { container } = renderComponent({ isMobile: true })

    expect(container).toMatchSnapshot()
  })

  it('hides zendesk logo when hideZendeskLogo is true', () => {
    const { store, queryByTestId } = renderComponent({
      hideZendeskLogo: true
    })
    dispatchUpdateEmbeddableConfig(store, { hideZendeskLogo: true })

    expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
  })
})

describe('help center channel button', () => {
  it('renders', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Leave us a message')).toBeInTheDocument()
  })
})

describe('searching', () => {
  const search = (query, renderProps = {}) => {
    const performSearch = jest.fn()
    const utils = renderComponent({ performSearch, ...renderProps })
    const input = utils.getByPlaceholderText('How can we help?')

    fireEvent.change(input, { target: { value: query } })
    fireEvent.submit(input)

    return { performSearch, ...utils }
  }
  const error = { ok: false, body: {} }
  const success = { ok: true, body: { results: articles, count: 3 } }
  const noResultsFound = { ok: true, body: { results: [], count: 0 } }
  const successFn = (fn, idx = 0) => fn.mock.calls[idx][1]
  const failFn = (fn, idx = 0) => fn.mock.calls[idx][2]

  beforeEach(() => {
    jest.spyOn(i18n, 'getLocale').mockReturnValue('en-AU')
  })

  it('does not call performSearch when there is no search query', () => {
    const { performSearch } = search('')

    expect(performSearch).not.toHaveBeenCalled()
  })

  it('calls performSearch with the expected arguments', () => {
    const { performSearch } = search('Help me')

    expect(performSearch).toHaveBeenCalledWith(
      'Help me',
      expect.any(Function),
      expect.any(Function)
    )
  })

  it('calls showBackButton on success', () => {
    const showBackButton = jest.fn()
    const { performSearch } = search('Help me', { showBackButton })

    successFn(performSearch)(success)
    expect(showBackButton).toHaveBeenCalledWith(false)
  })

  it('focuses on search field when result is an error', () => {
    const { performSearch, getByTestId } = search('Help me')

    failFn(performSearch)(error)
    expect(getByTestId('Icon--search')).toHaveClass('focused')
  })

  it('falls back to no locale when frst search returns no results', () => {
    const { performSearch } = search('Help me')

    expect(performSearch).toHaveBeenCalledWith(
      'Help me',
      expect.any(Function),
      expect.any(Function)
    )

    successFn(performSearch)(noResultsFound)

    expect(performSearch).toHaveBeenCalledWith(
      'Help me',
      expect.any(Function),
      expect.any(Function)
    )
  })

  it('falls back to the fallback url when search returns no results', () => {
    const { performSearch } = search('Help me', {
      localeFallbacks: ['fr', 'es']
    })

    expect(performSearch).toHaveBeenCalledWith(
      'Help me',
      expect.any(Function),
      expect.any(Function)
    )

    successFn(performSearch)(noResultsFound)

    expect(performSearch).toHaveBeenCalledWith(
      'Help me',
      expect.any(Function),
      expect.any(Function)
    )

    successFn(performSearch)(noResultsFound)

    expect(performSearch).toHaveBeenCalledWith(
      'Help me',
      expect.any(Function),
      expect.any(Function)
    )
  })
})

describe('renderArticles', () => {
  describe('when articleViewActive is true', () => {
    it('renders the article page', () => {
      expect(
        renderComponent({ articleViewActive: true }).getByText('ArticlePage')
      ).toBeInTheDocument()
    })

    it('does not render the regular page', () => {
      expect(
        renderComponent({ articleViewActive: true }).queryByText('How can we help?')
      ).toBeNull()
    })
  })

  describe('when articleViewActive is false', () => {
    it('does not render articlePage', () => {
      expect(renderComponent({ articleViewActive: false }).queryByText('ArticlePage')).toBeNull()
    })

    it('does render other page', () => {
      expect(
        renderComponent({ articleViewActive: false }).getByText('How can we help?')
      ).toBeInTheDocument()
    })
  })
})
