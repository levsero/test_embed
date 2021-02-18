import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ChatEmailTranscriptModal from 'embeds/chat/components/EmailTranscriptModal'
import ChatContactDetailsModal from 'src/embeds/chat/components/ContactDetails'
import EndChatModal from 'src/embeds/chat/components/Modals/EndChat'
import { getEmailTranscript, getIsEndChatModalVisible } from 'src/redux/modules/chat/chat-selectors'
import { getEditContactDetails } from 'embeds/chat/selectors'
import {
  endChatViaPostChatScreen,
  updateEmailTranscriptVisibility,
  updateEndChatModalVisibility,
  updateContactDetailsVisibility,
} from 'src/redux/modules/chat'
import { TEST_IDS } from 'src/constants/shared'

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
