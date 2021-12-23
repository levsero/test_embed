import LoadingButton from 'classicSrc/embeds/talk/components/LoadingButton'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  Button,
  Container,
  Dot,
  DotContainer,
  Message,
  TopSectionContainer,
  BottomSectionContainer,
  EmbeddedVoiceIcon,
} from './styles'

const MicrophonePermissions = ({
  onStartCallClicked,
  showStartCallButton = false,
  onPermissionsGiven,
}) => {
  const translate = useTranslate()
  const [isEstablishingCall, setIsEstablishingCall] = useState(false)

  return (
    <Container>
      <TopSectionContainer>
        <EmbeddedVoiceIcon />
        <Message>
          {translate('embeddable_framework.talk.embeddedVoice.landingPage.description')}
        </Message>
      </TopSectionContainer>
      <BottomSectionContainer>
        {showStartCallButton ? (
          <LoadingButton
            isPrimary={true}
            onClick={(...args) => {
              setIsEstablishingCall(true)
              onStartCallClicked(...args)
            }}
            isLoading={isEstablishingCall}
            label={translate('embeddable_framework.talk.embeddedVoice.button.startCall')}
          />
        ) : (
          <Button isPrimary={true} onClick={onPermissionsGiven}>
            {translate('embeddable_framework.talk.embeddedVoice.button.next')}
          </Button>
        )}
        <DotContainer>
          {!showStartCallButton && <Dot isActive={true} />}
          {!showStartCallButton && <Dot />}
        </DotContainer>
      </BottomSectionContainer>
    </Container>
  )
}

MicrophonePermissions.propTypes = {
  onStartCallClicked: PropTypes.func.isRequired,
  showStartCallButton: PropTypes.bool,
  onPermissionsGiven: PropTypes.func.isRequired,
}

MicrophonePermissions.defaultProps = {
  showStartCallButton: false,
}

export default MicrophonePermissions
