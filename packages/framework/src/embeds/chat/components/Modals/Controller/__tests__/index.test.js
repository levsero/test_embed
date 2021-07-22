import { TEST_IDS } from 'constants/shared'
import { render } from 'src/util/testHelpers'
import { Component as Controller } from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    editContactDetails: { show: false },
    emailTranscript: { show: false },
    endChatModalVisible: false,
    endChatViaPostChatScreen: jest.fn(),
    updateEndChatModalVisibility: jest.fn(),
  }

  return render(<Controller {...defaultProps} {...props} />)
}

describe('Modal Controller', () => {
  describe('when no Modals should be active', () => {
    it('renders null', () => {
      const { queryByTestId } = renderComponent()

      expect(queryByTestId(TEST_IDS.CHAT_EDIT_CONTACT_DETAILS_MODAL)).toBeNull()
      expect(queryByTestId(TEST_IDS.CHAT_EMAIL_TRANSCRIPT_MODAL)).toBeNull()
      expect(queryByTestId(TEST_IDS.CHAT_END_MODAL)).toBeNull()
    })
  })

  describe('when it should render EditContactDetails', () => {
    it('renders the EditContactDetails Modal', () => {
      const { getByTestId } = renderComponent({ editContactDetails: { show: true } })

      expect(getByTestId(TEST_IDS.CHAT_EDIT_CONTACT_DETAILS_MODAL)).toBeInTheDocument()
    })
  })

  describe('when it should render EmailTranscript', () => {
    it('renders the EmailTranscript Modal', () => {
      const { getByTestId } = renderComponent({ emailTranscript: { show: true } })

      expect(getByTestId(TEST_IDS.CHAT_EMAIL_TRANSCRIPT_MODAL)).toBeInTheDocument()
    })
  })

  describe('when it should render EndChat', () => {
    it('renders the EndChat Modal', () => {
      const { getByTestId } = renderComponent({ endChatModalVisible: true })

      expect(getByTestId(TEST_IDS.CHAT_END_MODAL)).toBeInTheDocument()
    })
  })
})
