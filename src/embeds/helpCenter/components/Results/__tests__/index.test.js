import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'

import { Component as Results } from '../index'

const renderComponent = props => {
  const mergedProps = {
    articles: [],
    ...props
  }

  return render(
    <Provider store={createStore()}>
      <Results {...mergedProps} />
    </Provider>
  )
}

describe('render', () => {
  it('when there are article', () => {
    const { getByText } = renderComponent({ articles: [1, 2, 3] })

    expect(getByText('Top results')).toBeInTheDocument()
  })

  it('when there are no articles', () => {
    const { getByText } = renderComponent()

    expect(getByText('Try searching for something else.')).toBeInTheDocument()
  })
})
