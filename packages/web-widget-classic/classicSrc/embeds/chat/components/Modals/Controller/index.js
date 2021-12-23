import { TEST_IDS } from 'classicSrc/constants/shared'
import ChatContactDetailsModal from 'classicSrc/embeds/chat/components/ContactDetails'
import ChatEmailTranscriptModal from 'classicSrc/embeds/chat/components/EmailTranscriptModal'
import EndChatModal from 'classicSrc/embeds/chat/components/Modals/EndChat'
import {
  getEditContactDetails,
  getEmailTranscript,
  getIsEndChatModalVisible,
} from 'classicSrc/embeds/chat/selectors'
import {
  endChatViaPostChatScreen,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
  updateContactDetailsVisibility,
} from 'classicSrc/redux/modules/chat'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Controller = ({
  editContactDetails,
  emailTranscript,
  endChatModalVisible,
  endChatViaPostChatScreen,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
}) => {
  return (
    <div data-testid={TEST_IDS.CHAT_MODAL_CONTAINER}>
      {editContactDetails.show && (
        <ChatContactDetailsModal onClose={() => updateContactDetailsVisibility(false)} />
      )}
      {emailTranscript.show && (
        <ChatEmailTranscriptModal onClose={() => updateEmailTranscriptVisibility(false)} />
      )}
      {endChatModalVisible && (
        <EndChatModal
          endChatViaPostChatScreen={endChatViaPostChatScreen}
          onClose={() => updateEndChatModalVisibility(false)}
        />
      )}
    </div>
  )
}

Controller.propTypes = {
  editContactDetails: PropTypes.shape({
    show: PropTypes.bool,
  }),
  emailTranscript: PropTypes.shape({
    show: PropTypes.bool,
  }),
  endChatModalVisible: PropTypes.bool,
  endChatViaPostChatScreen: PropTypes.func,
  updateContactDetailsVisibility: PropTypes.func,
  updateEmailTranscriptVisibility: PropTypes.func,
  updateEndChatModalVisibility: PropTypes.func,
}

const mapStateToProps = (state) => ({
  editContactDetails: getEditContactDetails(state),
  emailTranscript: getEmailTranscript(state),
  endChatModalVisible: getIsEndChatModalVisible(state),
})

const actionCreators = {
  endChatViaPostChatScreen,
  updateContactDetailsVisibility,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
}

const connectedComponent = connect(mapStateToProps, actionCreators)(Controller)

export { connectedComponent as default, Controller as Component }
