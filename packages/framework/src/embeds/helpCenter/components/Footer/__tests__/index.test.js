import { render } from 'utility/testHelpers'
import React from 'react'

import HelpCenterFooter from '../index'

const renderComponent = (props) => {
  const mergedProps = {
    onClick: noop,
    showNextButton: false,
    ...props,
  }

  return render(<HelpCenterFooter {...mergedProps} />)
}

describe('HelpCenterFooter', () => {
  it('renders empty footer when showNextButton is false', () => {
    const { queryByText } = renderComponent({ showNextButton: false })

    expect(queryByText('Leave us a message')).not.toBeInTheDocument()
  })

  it('renders button when showNextButton is true', () => {
    const { queryByText } = renderComponent({ showNextButton: true })

    expect(queryByText('Leave us a message')).toBeInTheDocument()
  })
})
