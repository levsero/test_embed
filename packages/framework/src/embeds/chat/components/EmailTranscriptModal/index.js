import PropTypes from 'prop-types'
import { useState } from 'react'
import { withTheme } from 'styled-components'
import { TEST_IDS } from 'src/constants/shared'
import EmailTranscriptForm from 'src/embeds/chat/components/EmailTranscriptModal/EmailTranscriptForm'
import EmailTranscriptSuccess from 'src/embeds/chat/components/EmailTranscriptModal/EmailTranscriptSuccess'
import { StyledModal } from './styles'

const EmailTranscriptModal = ({ onClose }) => {
  const [container, setContainer] = useState(null)
  const [updatedEmail, setUpdatedEmail] = useState(null)

  return (
    <>
      <div ref={(ref) => setContainer(ref)} data-testid={TEST_IDS.CHAT_EMAIL_TRANSCRIPT_MODAL} />
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
        >
          {updatedEmail ? (
            <EmailTranscriptSuccess email={updatedEmail} />
          ) : (
            <EmailTranscriptForm onSuccess={(email) => setUpdatedEmail(email)} onClose={onClose} />
          )}
        </StyledModal>
      )}
    </>
  )
}

EmailTranscriptModal.propTypes = {
  onClose: PropTypes.func,
}

export default withTheme(EmailTranscriptModal)
