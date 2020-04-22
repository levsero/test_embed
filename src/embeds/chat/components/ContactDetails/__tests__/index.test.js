import React from 'react'
import Component from 'src/embeds/chat/components/ContactDetails'
import { render } from 'src/util/testHelpers'

describe('Contact Details Modal', () => {
  const onClose = jest.fn()

  const renderComponent = (props = {}) => {
    const defaultProps = {
      onClose
    }

    return render(<Component {...defaultProps} {...props} />)
  }

  it('contains Cancel button', () => {
    const { getByText } = renderComponent()
    expect(getByText('Cancel')).toBeInTheDocument()
  })
  it('contains Save button', () => {
    const { getByText } = renderComponent()
    expect(getByText('Save')).toBeInTheDocument()
  })
  it('contains name field', () => {
    const { getByText } = renderComponent()
    expect(getByText('Name')).toBeInTheDocument()
  })
  it('contains email field', () => {
    const { getByText } = renderComponent()
    expect(getByText('Email')).toBeInTheDocument()
  })
})
