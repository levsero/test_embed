import React, { useState } from 'react'
import PropTypes from 'prop-types'
import EmailTranscriptForm from 'embeds/chat/components/EmailTranscriptModal/EmailTranscriptForm'
import { Modal } from 'src/embeds/webWidget/components/Modal'
import { withTheme } from 'styled-components'
import EmailTranscriptSuccess from 'embeds/chat/components/EmailTranscriptModal/EmailTranscriptSuccess'
import { TEST_IDS } from 'constants/shared'

const EmailTranscriptModal = ({ onClose }) => {
  const [container, setContainer] = useState(null)
  const [updatedEmail, setUpdatedEmail] = useState(null)

  return (
    <>
      <div ref={ref => setContainer(ref)} data-testid={TEST_IDS.CHAT_EMAIL_TRANSCRIPT_MODAL} />
      {container && (
        <Modal
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
        >
          {updatedEmail ? (
            <EmailTranscriptSuccess email={updatedEmail} />
          ) : (
            <EmailTranscriptForm onSuccess={email => setUpdatedEmail(email)} onClose={onClose} />
          )}
        </Modal>
      )}
    </>
  )
}

EmailTranscriptModal.propTypes = {
  onClose: PropTypes.func
}

export default withTheme(EmailTranscriptModal)