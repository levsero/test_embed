import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { render } from 'src/util/testHelpers'
import MicrophonePermissionsDeniedPage from '../'

const renderComponent = (props = { onClick: jest.fn() }) => {
  return render(<MicrophonePermissionsDeniedPage {...props} />)
}

describe('MicrophonePermissionsDeniedPage', () => {
  it('renders heading', () => {
    renderComponent()

    expect(screen.getByText('Microphone access needed')).toBeInTheDocument()
  })

  it('renders message', () => {
    renderComponent()

    expect(
      screen.getByText(
        'This permission may have been denied. Check browser settings to grant this permission.'
      )
    ).toBeInTheDocument()
  })

  describe('Try again button', () => {
    it('fires prop onClick when clicked', () => {
      const onClick = jest.fn()
      renderComponent({ onClick })

      userEvent.click(screen.getByText('Try again'))

      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })
})
