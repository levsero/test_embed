import render from 'src/utils/test/render'
import MessageBubble from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    isPrimaryParticipant: true,
    status: 'sent',
    children: 'nightcall',
  }
  return render(<MessageBubble {...defaultProps} {...props} />)
}

describe('MessageBubble', () => {
  describe('for primary participant', () => {
    describe('when message status is sent', () => {
      it('renders a message bubble', () => {
        const { getByText } = renderComponent()
        expect(getByText('nightcall')).toBeInTheDocument()
        expect(getByText('nightcall')).toBeInTheDocument()
      })

      it('displays color styles for a successful message', () => {
        const { getByText } = renderComponent()

        expect(getByText('nightcall')).toHaveStyleRule('background-color', '#03363d')
        expect(getByText('nightcall')).toHaveStyleRule('color', '#fff')
      })
    })

    describe('when message status is sending', () => {
      it('displays color and opacity styles for a pending message', () => {
        const { getByText } = renderComponent({ status: 'sending' })

        expect(getByText('nightcall')).toHaveStyleRule('opacity', '0.66')
      })
    })

    describe('when message status is failed', () => {
      it('displays default color styles for a failed message', () => {
        const { getByText } = renderComponent({ status: 'failed' })

        expect(getByText('nightcall')).toHaveStyleRule('background-color', '#fff0f1')
        expect(getByText('nightcall')).toHaveStyleRule('color', '#8c232c')
      })

      it('displays color styles for a failed image message', () => {
        const { getByText } = renderComponent({ status: 'failed', type: 'image' })

        expect(getByText('nightcall')).toHaveStyleRule('background-color', '#8c232c')
      })
    })
  })
})
