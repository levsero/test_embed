import { render } from '@testing-library/react'
import React from 'react'

import Results from '../index'

const renderComponent = props => {
  const mergedProps = {
    hasContextualSearched: false,
    isContextualSearchComplete: false,
    isMobile: false,
    ...props
  }

  return render(<Results {...mergedProps} />)
}

const articles = [
  {
    html_url: 'http://www.example.com',
    title: 'Test article one',
    name: 'Test article 1'
  },
  {
    html_url: 'http://www.example.com',
    title: 'Test article two',
    name: 'Test article 2'
  }
]

describe('no results', () => {
  test('renders expected classes', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  test('renders expected mobile classes', () => {
    const { container } = renderComponent({ isMobile: true })

    expect(container).toMatchSnapshot()
  })
})

describe('with results', () => {
  test('renders expected classes', () => {
    const { container } = renderComponent({ articles })

    expect(container).toMatchSnapshot()
  })

  test('renders expected mobile classes', () => {
    const { container } = renderComponent({ articles, isMobile: true })

    expect(container).toMatchSnapshot()
  })

  test('renders expected heading when hasContextualSearched is true', () => {
    const { queryByText } = renderComponent({
      hasContextualSearched: true,
      articles
    })

    expect(queryByText('Top suggestions')).toBeInTheDocument()
  })

  test('renders expected heading when hasContextualSearched is false', () => {
    const { queryByText } = renderComponent({
      hasContextualSearched: false,
      articles
    })

    expect(queryByText('Top results')).toBeInTheDocument()
  })

  describe('listBottom style', () => {
    test('contains style if showContactButton is true', () => {
      const { container } = renderComponent({
        showContactButton: true,
        articles
      })

      expect(container.querySelector('ol')).toHaveClass('listBottom')
    })

    test('contains style if hideZendeskLogo is true and showContactButton is false', () => {
      const { container } = renderComponent({
        hideZendeskLogo: true,
        showContactButton: false,
        articles
      })

      expect(container.querySelector('ol')).toHaveClass('listBottom')
    })

    test('does not contain style if hideZendeskLogo and showContactButton are false', () => {
      const { container } = renderComponent({
        hideZendeskLogo: false,
        showContactButton: false,
        articles
      })

      expect(container.querySelector('ol')).not.toHaveClass('listBottom')
    })
  })
})

describe('messaging', () => {
  test('has contextual searched and contextual search is complete', () => {
    const { queryByText } = renderComponent({
      hasContextualSearched: true,
      isContextualSearchComplete: true
    })

    expect(
      queryByText('Enter a term in the search bar above to find articles.')
    ).toBeInTheDocument()
  })

  test('has not contextual searched', () => {
    const { queryByText } = renderComponent({
      hasContextualSearched: false
    })

    expect(queryByText('There are no results for ""')).toBeInTheDocument()
    expect(queryByText('Try searching for something else.')).toBeInTheDocument()
  })

  test('contextual help enabled and has searched is false', () => {
    const { queryByText } = renderComponent({
      contextualHelpEnabled: true,
      hasSearched: false
    })

    expect(queryByText('There are no results for ""')).toBeInTheDocument()
    expect(queryByText('Try searching for something else.')).toBeInTheDocument()
  })

  test('search has not failed and previous search term is present', () => {
    const { queryByText } = renderComponent({
      searchFailed: false,
      previousSearchTerm: 'Help me!'
    })

    expect(queryByText('There are no results for "Help me!"')).toBeInTheDocument()
    expect(queryByText('Try searching for something else.')).toBeInTheDocument()
  })

  test('search has failed and showing contact button', () => {
    const { queryByText } = renderComponent({
      searchFailed: true,
      showContactButton: true
    })

    expect(queryByText('Sorry, there are no results.')).toBeInTheDocument()
    expect(queryByText('Click the button below to send us a message.')).toBeInTheDocument()
  })

  test('search has failed and not showing contact button', () => {
    const { queryByText } = renderComponent({
      searchFailed: true,
      showContactButton: false
    })

    expect(queryByText('Sorry, there are no results.')).toBeInTheDocument()
    expect(queryByText('Click the button below to send us a message.')).not.toBeInTheDocument()
  })
})
