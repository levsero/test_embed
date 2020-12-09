import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import routes from 'src/embeds/talk/routes'

import LoadingButton from 'embeds/talk/components/LoadingButton'

import { Button, Container, Dot, DotContainer, Heading, Message, SectionContainer } from './styles'

const MicrophonePermissions = ({ onStartCallClicked, showStartCallButton = false }) => {
  const [isEstablishingCall, setIsEstablishingCall] = useState(false)
  const history = useHistory()

  const onPermissionsGiven = () => {
    history.push(routes.clickToCallConsent())
  }

  return (
    <Container>
      <SectionContainer>
        <Heading>Allow microphone</Heading>
        <Message>
          This app needs permission to use your microphone before you can start a call.
        </Message>
      </SectionContainer>
      <SectionContainer>
        {showStartCallButton ? (
          <LoadingButton
            isPrimary={true}
            onClick={(...args) => {
              setIsEstablishingCall(true)
              onStartCallClicked(...args)
            }}
            isLoading={isEstablishingCall}
            label="Start Call"
          />
        ) : (
          <Button isPrimary={true} onClick={onPermissionsGiven}>
            Next
          </Button>
        )}
        <DotContainer>
          {!showStartCallButton && <Dot isActive={true} />}
          {!showStartCallButton && <Dot />}
        </DotContainer>
      </SectionContainer>
    </Container>
  )
}

MicrophonePermissions.propTypes = {
  onStartCallClicked: PropTypes.func.isRequired,
  showStartCallButton: PropTypes.bool
}

MicrophonePermissions.defaultProps = {
  showStartCallButton: false
}

export default MicrophonePermissions
