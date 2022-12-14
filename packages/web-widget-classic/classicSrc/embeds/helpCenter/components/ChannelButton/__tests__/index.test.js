import { render, fireEvent } from '@testing-library/react'
import { Component as ChannelButton } from 'classicSrc/embeds/helpCenter/components/ChannelButton'

const onClickMock = jest.fn()

const renderComponent = (props) => {
  onClickMock.mockReset()
  const defaultProps = {
    buttonLabel: 'defaultButtonLabel',
    isRTL: false,
    loading: false,
    onClick: onClickMock(),
    isMobile: false,
  }

  const combinedProps = {
    ...defaultProps,
    ...props,
  }

  return render(<ChannelButton {...combinedProps} />)
}

describe('ChannelButton', () => {
  describe('defaults', () => {
    it('renders a button with default label', () => {
      const result = renderComponent()
      expect(result.getByText('defaultButtonLabel')).toBeInTheDocument()
    })
  })

  describe('when button is clicked', () => {
    it('fires onClick event', () => {
      const result = renderComponent()

      fireEvent.click(result.getByText('defaultButtonLabel'))

      expect(onClickMock).toHaveBeenCalled()
    })
  })
})
