import { Component as NoResults } from '../'
import React from 'react'
import { render } from '@testing-library/react'

const renderComponent = inProps => {
  const props = {
    isMobile: false,
    searchFailed: false,
    previousSearchTerm: 'whoopsies',
    showNextButton: false,
    shouldShowContextualResults: false,
    ...inProps
  }

  return render(<NoResults {...props} />)
}

describe('render', () => {
  describe('when has not contextual searched', () => {
    it('renders NoResultsMessage', () => {
      const { getByText } = renderComponent()

      expect(getByText('There are no results for "whoopsies"')).toBeInTheDocument()
    })
  })

  describe('when has  contextual searched', () => {
    it('renders ContextualNoResultsMessage', () => {
      const { getByText } = renderComponent({
        shouldShowContextualResults: true
      })

      expect(
        getByText('Enter a term in the search bar above to find articles.')
      ).toBeInTheDocument()
    })
  })
})
