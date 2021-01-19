import React from 'react'
import { render } from 'src/util/testHelpers'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import NetworkError from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    onClick: jest.fn()
  }
  return render(<NetworkError {...defaultProps} {...props} />)
}

describe('NetworkError', () => {
  it('renders the title', () => {
    renderComponent()

    expect(screen.getByText("Call couldn't be connected")).toBeInTheDocument()
  })

  it('renders the message', () => {
    renderComponent()

    expect(screen.getByText('Check your internet connection and try again.')).toBeInTheDocument()
  })

  it('renders the Reconnect button', () => {
    renderComponent()

    expect(screen.getByText('Reconnect')).toBeInTheDocument()
  })

  it('fires the onClick event when the Reconnect button is clicked', () => {
    const onClick = jest.fn()
    renderComponent({ onClick })

    userEvent.click(screen.getByText('Reconnect'))

    expect(onClick).toHaveBeenCalled()
  })
})
