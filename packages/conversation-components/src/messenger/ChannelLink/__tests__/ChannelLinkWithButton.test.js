import userEvent from '@testing-library/user-event'
import render from 'src/utils/test/render'
import ChannelLinkWithButton from '../ChannelLinkWithButton'

const renderComponent = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
    status: 'success',
  }

  return render(<ChannelLinkWithButton {...defaultProps} {...props} />)
}

describe('<ChannelLinkWithButton>', () => {
  describe('when the status is success', () => {
    it('renders a button with channel link url', () => {
      const { getByText } = renderComponent()

      expect(getByText('Open Messenger')).toBeInTheDocument()

      window.open = jest.fn()
      getByText('Open Messenger').click()
      expect(window.open).toHaveBeenCalled()
    })

    it('opens a new window when clicked', () => {
      const { getByText } = renderComponent()

      window.open = jest.fn()
      getByText('Open Messenger').click()
      expect(window.open).toHaveBeenCalledWith(
        'www.awesomeurl.com',
        '_blank',
        'noopener,noreferrer'
      )
    })
  })

  describe('when the status is error', () => {
    it('renders an error message and retry button', () => {
      const { getByText } = renderComponent({ status: 'error' })

      expect(getByText("Link couldn't be loaded")).toBeInTheDocument()
      expect(getByText('Click to retry')).toBeInTheDocument()
    })

    it('fires onRetry when retry button is clicked', () => {
      const onRetry = jest.fn()
      const { getByText } = renderComponent({ onRetry, status: 'error' })

      getByText('Click to retry').click()

      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('when the status is loading', () => {
    it('renders a loading spinner', () => {
      const { getByRole } = renderComponent({ status: 'loading' })

      expect(getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('when the status is pending', () => {
    it('renders a loading spinner', () => {
      const { getByRole } = renderComponent({ status: 'pending' })

      expect(getByRole('progressbar')).toBeInTheDocument()
    })

    it('gives the user the ability to generate a new link', () => {
      const onRetry = jest.fn()
      const { getByText } = renderComponent({ status: 'pending', onRetry })

      userEvent.click(getByText('Generate new link'))

      expect(onRetry).toHaveBeenCalled()
    })

    it('displays hidden text inside the button so its width does not change when spinner is displayed', () => {
      const { getByText } = renderComponent({ status: 'pending' })

      expect(getByText('Open Messenger')).toHaveStyleRule('visibility', 'hidden')
      expect(getByText('Open Messenger')).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('when an integration with an account tag is included', () => {
    it('updates the instructions to point to that @tag', () => {
      const { getByText } = renderComponent({
        channelId: 'instagram',
        url: 'https://instagram.com/totallycoolthing',
        businessUsername: 'totallycoolthing',
        status: 'success',
      })

      expect(getByText('Follow @totallycoolthing to send a DM.')).toBeInTheDocument()
    })
  })
})
