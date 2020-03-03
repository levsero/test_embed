import React, { useState } from 'react'
import PropTypes from 'prop-types'
import EmailTranscriptForm from 'embeds/chat/components/EmailTranscriptPopup/EmailTranscriptForm'
import { Modal } from 'src/embeds/webWidget/components/Modal'
import { withTheme } from 'styled-components'
import EmailTranscriptSuccess from 'embeds/chat/components/EmailTranscriptPopup/EmailTranscriptSuccess'

const EmailTranscriptPopup = ({ onClose }) => {
  const [container, setContainer] = useState(null)
  const [updatedEmail, setUpdatedEmail] = useState(null)

  return (
    <>
      <div ref={ref => setContainer(ref)} />
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

EmailTranscriptPopup.propTypes = {
  onClose: PropTypes.func
}

export default withTheme(EmailTranscriptPopup)
