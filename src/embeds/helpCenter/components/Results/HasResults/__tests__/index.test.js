import { Component as HasResults } from '../'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
const handleArticleClickSpy = jest.fn()
const updateBackButtonVisibilitySpy = jest.fn()

const renderComponent = inProps => {
  const props = {
    handleArticleClick: handleArticleClickSpy,
    updateBackButtonVisibility: updateBackButtonVisibilitySpy,
    articles: [{ title: 'hello darkness' }, { title: 'my old friend' }],
    ...inProps
  }

  return render(<HasResults {...props} />)
}

describe('default render', () => {
  it('renders legend', () => {
    const { getByText } = renderComponent()

    expect(getByText('Top results')).toBeInTheDocument()
  })

  it('renders article names in list', () => {
    const { getByText } = renderComponent()

    expect(getByText('hello darkness')).toBeInTheDocument()
    expect(getByText('my old friend')).toBeInTheDocument()
  })

  describe('when an item is clicked', () => {
    it('fires handleArticleClick with the clicked article', () => {
      const { getByText } = renderComponent()

      fireEvent.click(getByText('hello darkness'))
      expect(handleArticleClickSpy).toHaveBeenCalledWith({ title: 'hello darkness' })
    })

    it('fires updateBackButtonVisibility', () => {
      const { getByText } = renderComponent()

      fireEvent.click(getByText('my old friend'))
      expect(handleArticleClickSpy).toHaveBeenCalledWith({ title: 'my old friend' })
      expect(updateBackButtonVisibilitySpy).toHaveBeenCalled()
    })
  })
})
