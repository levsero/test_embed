import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import Component from '..'

const onClick = jest.fn()
const form = {
  id: 42,
  display_name: 'the goggles do nothing'
}
const renderComponent = (props = {}) => {
  const defaultProps = {
    form,
    onClick
  }

  return render(<Component {...defaultProps} {...props} />)
}

describe('TicketFormOption', () => {
  it('renders', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  describe('when clicked', () => {
    it('calls the onClick handler', () => {
      const { getByText } = renderComponent()

      fireEvent.click(getByText(form.display_name))

      expect(onClick).toHaveBeenCalledWith(form.id)
    })
  })
})
