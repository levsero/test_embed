import React from 'react'
import { render } from 'src/util/testHelpers'

import { Component as PrechatFormOfflineMessageSuccessPage } from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    hideZendeskLogo: false,
    title: 'A fancy form',
  }

  return render(<PrechatFormOfflineMessageSuccessPage {...defaultProps} {...props} />)
}

describe('PrechatFormOfflineMessageSuccessPage', () => {
  it('renders the expected title', () => {
    const { getByText } = renderComponent()

    expect(getByText('A fancy form')).toBeInTheDocument()
  })

  it('renders success text', () => {
    const { getByText } = renderComponent()

    expect(getByText('Thanks for reaching out')).toBeInTheDocument()
    expect(getByText('Someone will get back to you soon')).toBeInTheDocument()
  })

  it('renders Back button', () => {
    const { getByText } = renderComponent()

    expect(getByText('Go Back')).toBeInTheDocument()
  })
})
