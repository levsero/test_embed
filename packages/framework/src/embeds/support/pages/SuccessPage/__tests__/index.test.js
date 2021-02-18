import React from 'react'
import { render } from 'src/util/testHelpers'
import { Component as SuccessPage } from '..'

describe('SuccessPage', () => {
  const defaultProps = {
    onCancelClick: jest.fn(),
    history: { replace: jest.fn() },
  }

  const renderComponent = (props = {}) => render(<SuccessPage {...defaultProps} {...props} />)

  it('renders a title', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Message sent')).toBeInTheDocument()
  })

  it('renders a message letting the user know the form has been submitted', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Thanks for reaching out')).toBeInTheDocument()
    expect(queryByText('Someone will get back to you soon')).toBeInTheDocument()
  })

  it('calls onCancelClick when "Back" is clicked', () => {
    const onCancelClick = jest.fn()
    const { queryByText } = renderComponent({ onCancelClick })

    queryByText('Go Back').click()

    expect(onCancelClick).toHaveBeenCalled()
  })
})
