import render from 'src/utils/test/render'
import MessageBubble from '../'

const renderPrimaryParticipantMessage = (props = {}) => {
  const defaultProps = {
    isPrimaryParticipant: true,
    status: 'sent',
  }
  return render(<MessageBubble {...defaultProps} {...props} />)
}

const PARTICIPANT_BUBBLE_TEST_ID = 'participant-bubble'

describe('MessageBubble', () => {
  describe('PrimaryParticipantBubble', () => {
    describe('when message status is sent', () => {
      it('renders a message bubble', () => {
        const { getByTestId } = renderPrimaryParticipantMessage()
        expect(getByTestId(PARTICIPANT_BUBBLE_TEST_ID)).toBeInTheDocument
      })

      it('displays styles for a successful message', () => {
        const { getByTestId } = renderPrimaryParticipantMessage()

        expect(getByTestId(PARTICIPANT_BUBBLE_TEST_ID)).toHaveStyleRule(
          'background-color',
          '#03363d'
        )
        expect(getByTestId(PARTICIPANT_BUBBLE_TEST_ID)).toHaveStyleRule('color', '#fff')
      })
    })

    describe('when message status is sending', () => {
      it('displays styles for a pending message', () => {
        const { getByTestId } = renderPrimaryParticipantMessage({ status: 'sending' })

        expect(getByTestId(PARTICIPANT_BUBBLE_TEST_ID)).toHaveStyleRule('opacity', '0.66')
      })
    })

    describe('when message status is failed', () => {
      it('displays default primary participant styles for a failed message', () => {
        const { getByTestId } = renderPrimaryParticipantMessage({ status: 'failed' })

        expect(getByTestId(PARTICIPANT_BUBBLE_TEST_ID)).toHaveStyleRule(
          'background-color',
          '#fff0f1'
        )
        expect(getByTestId(PARTICIPANT_BUBBLE_TEST_ID)).toHaveStyleRule('color', '#8c232c')
      })

      it('displays styles for a failed image message', () => {
        const { getByTestId } = renderPrimaryParticipantMessage({ status: 'failed', type: 'image' })

        expect(getByTestId(PARTICIPANT_BUBBLE_TEST_ID)).toHaveStyleRule(
          'background-color',
          '#8c232c'
        )
      })
    })
  })
})
