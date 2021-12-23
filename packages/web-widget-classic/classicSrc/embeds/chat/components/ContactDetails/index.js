import { TEST_IDS } from 'classicSrc/constants/shared'
import ChatContactDetailsForm from 'classicSrc/embeds/chat/components/ContactDetails/Form'
import ContactDetailsSuccess from 'classicSrc/embeds/chat/components/ContactDetails/Success'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { withTheme } from 'styled-components'
import { StyledModal } from './styles'

const ContactDetailsModal = ({ onClose }) => {
  const [container, setContainer] = useState(null)
  const [updatedValues, setUpdatedValues] = useState(false)

  return (
    <div ref={(ref) => setContainer(ref)}>
      {container && (
        <StyledModal
          backdropProps={{
            style: {
              position: 'absolute',
            },
          }}
          onClose={(e) => {
            e.stopPropagation()
            onClose()
          }}
          appendToNode={container}
          data-testid={TEST_IDS.CHAT_EDIT_CONTACT_DETAILS_MODAL}
        >
          {updatedValues ? (
            <ContactDetailsSuccess />
          ) : (
            <ChatContactDetailsForm onSuccess={() => setUpdatedValues(true)} />
          )}
        </StyledModal>
      )}
    </div>
  )
}

ContactDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

const themedComponent = withTheme(ContactDetailsModal)

export default themedComponent
