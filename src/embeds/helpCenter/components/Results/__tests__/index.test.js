import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import { MemoryRouter } from 'react-router-dom'
import * as selectors from 'embeds/helpCenter/selectors'

import Results from '../index'

const articles = [{ id: 1, title: 'jane eyre' }, { id: 2, title: 'pride and prejudice' }]

const renderComponent = () => {
  const store = createStore()

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    </Provider>
  )
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
