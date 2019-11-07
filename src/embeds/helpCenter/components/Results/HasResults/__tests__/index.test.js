import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Component as HasResults } from '../'

const handleArticleViewSpy = jest.fn()

const article1 = { id: 1, title: 'hello darkness', body: 'my old friend' }
const article2 = { id: 2, title: 'Hamlet', body: 'Alas, poor Yorrick!' }

const renderComponent = inProps => {
  const props = {
    handleArticleView: handleArticleViewSpy,
    articles: [article1, article2],
    ...inProps
  }

  return render(
    <MemoryRouter>
      <HasResults {...props} />
    </MemoryRouter>
  )
}

describe('default render', () => {
  it('renders legend', () => {
    const { getByText } = renderComponent()

    expect(getByText('Top results')).toBeInTheDocument()
  })

  it('renders article names in list', () => {
    const { getByText } = renderComponent()

    expect(getByText(article1.title)).toBeInTheDocument()
    expect(getByText(article2.title)).toBeInTheDocument()
  })
})
