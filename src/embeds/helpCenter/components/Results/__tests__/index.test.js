import { render } from 'utility/testHelpers'
import React from 'react'

import { Component as Results } from '../index'

const renderComponent = props => {
  const mergedProps = {
    articles: [],
    ...props
  }

  return render(<Results {...mergedProps} />)
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
