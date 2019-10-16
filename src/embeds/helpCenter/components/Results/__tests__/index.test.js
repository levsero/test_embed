import { render } from 'utility/testHelpers'
import React from 'react'
import * as selectors from 'embeds/helpCenter/selectors'

import Results from '../index'

const articles = [{ id: 1, title: 'jane eyre' }, { id: 2, title: 'pride and prejudice' }]

const renderComponent = () => {
  return render(<Results />)
}

describe('when there are articles', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'getArticles').mockReturnValue(articles)
  })

  it('renders the HasResultsPage with a list of articles', () => {
    const { getByText } = renderComponent()

    expect(getByText('Top results')).toBeInTheDocument()
    expect(getByText(articles[0].title)).toBeInTheDocument()
    expect(getByText(articles[1].title)).toBeInTheDocument()
  })
})

describe('when there are no articles', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'getArticles').mockReturnValue([])
  })

  it('renders the NoResults page suggesting a different search', () => {
    const { getByText } = renderComponent()

    expect(getByText('Try searching for something else.')).toBeInTheDocument()
  })
})
