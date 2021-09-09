import { rem } from 'polished'
import { find } from 'styled-components/test-utils'
import Notification from '../'
import { NOTIFICATION_TYPES } from '../../constants'
import render from '../../utils/test/render'
import { Container } from '../styles'

describe('Notification', () => {
  it('renders a notification message', () => {
    const { getByText } = render(<Notification messageType={NOTIFICATION_TYPES.connectError} />)

    expect(getByText("Couldn't connect. Try again.")).toBeInTheDocument()
  })

  describe('on desktop', () => {
    it('renders 40px from the bottom', () => {
      const themeProps = {
        isFullScreen: false,
        baseFontSize: '10px',
      }

      const { container } = render(<Notification messageType={NOTIFICATION_TYPES.connectError} />, {
        themeProps,
      })

      expect(find(container, Container)).toHaveStyleRule('bottom', rem(40, themeProps.baseFontSize))
    })
  })
  describe('on mobile', () => {
    it('renders 60px from the top while in landscape orientation', () => {
      const themeProps = {
        isFullScreen: true,
        baseFontSize: '10px',
      }

      const { container } = render(<Notification messageType={NOTIFICATION_TYPES.connectError} />, {
        themeProps,
      })

      expect(find(container, Container)).toHaveStyleRule('top', rem(60, themeProps.baseFontSize))
    })

    it('renders 20px from the top while in landscape orientation', () => {
      const themeProps = {
        isFullScreen: true,
        baseFontSize: '10px',
      }

      const { container } = render(<Notification messageType={NOTIFICATION_TYPES.connectError} />, {
        themeProps,
      })

      expect(find(container, Container)).toHaveStyleRule('top', rem(20, themeProps.baseFontSize), {
        media: '(orientation: landscape)',
      })
    })
  })
})
