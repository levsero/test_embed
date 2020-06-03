import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import ChatContactDetailsForm from 'src/embeds/chat/components/ContactDetails/Form'
import ContactDetailsSuccess from 'src/embeds/chat/components/ContactDetails/Success'
import { TEST_IDS } from 'constants/shared'
import { StyledModal } from './styles'

const ContactDetailsModal = ({ onClose }) => {
  const [container, setContainer] = useState(null)
  const [updatedValues, setUpdatedValues] = useState(false)

  return (
    <div ref={ref => setContainer(ref)}>
      {container && (
        <StyledModal
          backdropProps={{
            style: {
              position: 'absolute'
            }
          }}
          onClose={e => {
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
  onClose: PropTypes.func.isRequired
}

const themedComponent = withTheme(ContactDetailsModal)

export default themedComponent
