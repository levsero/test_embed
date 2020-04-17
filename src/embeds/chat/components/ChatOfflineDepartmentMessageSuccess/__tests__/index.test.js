import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'

import ChatOfflineDepartmentMessageSuccess from '..'

const onFormBack = jest.fn()
const renderComponent = (props = {}) => {
  const defaultProps = {
    offlineMessage: {
      details: {
        name: 'bob',
        email: 'test@test.com',
        phone: '1300 655 506',
        message: 'Frank Walker from national tiiiiiiiiiiiiles'
      }
    },
    onFormBack
  }

  return render(<ChatOfflineDepartmentMessageSuccess {...defaultProps} {...props} />)
}

describe('ChatOfflineDepartmentMessageSuccess', () => {
  it('renders confirmation', () => {
    const { getByText } = renderComponent()

    expect(
      getByText("Thanks for the message! We'll get back to you as soon as we can.")
    ).toBeInTheDocument()
  })

  it('renders the name', () => {
    const { getByText } = renderComponent()

    expect(getByText('bob')).toBeInTheDocument()
  })

  it('renders the email', () => {
    const { getByText } = renderComponent()

    expect(getByText('test@test.com')).toBeInTheDocument()
  })

  it('renders the phone number', () => {
    const { getByText } = renderComponent()

    expect(getByText('1300 655 506')).toBeInTheDocument()
  })

  it('renders the message', () => {
    const { getByText } = renderComponent()

    expect(getByText('Frank Walker from national tiiiiiiiiiiiiles')).toBeInTheDocument()
  })

  it('renders the button', () => {
    const { getByText } = renderComponent()

    expect(getByText('Send Another')).toBeInTheDocument()
  })

  describe('button', () => {
    it('when clicked, calls onFormBack', () => {
      const { getByText } = renderComponent()

      fireEvent.click(getByText('Send Another'))

      expect(onFormBack).toHaveBeenCalled()
    })
  })
})
