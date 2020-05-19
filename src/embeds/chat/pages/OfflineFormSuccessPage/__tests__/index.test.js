import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'

import { Component as OfflineFormSuccessPage } from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    onClick: jest.fn(),
    hideZendeskLogo: false,
    title: 'boop'
  }

  return render(<OfflineFormSuccessPage {...defaultProps} {...props} />)
}

describe('OfflineFormSuccessPage', () => {
  it('renders the expected title', () => {
    const { getByText } = renderComponent()

    expect(getByText('boop')).toBeInTheDocument()
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

  it('fires onClick when back button is pressed', () => {
    const onClick = jest.fn()
    const { getByText } = renderComponent({ onClick })

    fireEvent.click(getByText('Go Back'))

    expect(onClick).toHaveBeenCalled()
  })
})
