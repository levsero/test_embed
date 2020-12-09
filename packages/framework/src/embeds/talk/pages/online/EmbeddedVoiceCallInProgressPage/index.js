import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { getMicrophoneMuted } from 'src/embeds/talk/selectors'
import { muteMicrophone, unmuteMicrophone } from 'src/embeds/talk/actions'
import {
  CallButton,
  CallControls,
  Container,
  Control,
  Label,
  MicrophoneIcon,
  MuteButton,
  MutedMicrophoneIcon,
  PhoneIcon,
  Section,
  Timer
} from './styles'

const EmbeddedVoiceCallInProgressPage = ({
  callDuration = '30:00',
  onEndCallClicked = () => {},
  onMuteClick = () => {}
}) => {
  const dispatch = useDispatch()
  const isMuted = useSelector(getMicrophoneMuted)

  const handleMuteClick = () => {
    if (isMuted) {
      dispatch(unmuteMicrophone())
      onMuteClick(false)
    } else {
      dispatch(muteMicrophone())
      onMuteClick(true)
    }
  }

  const MicIcon = isMuted ? MutedMicrophoneIcon : MicrophoneIcon

  return (
    <Container>
      <Section>
        <Label>Call in progress</Label>
        <Timer>{callDuration}</Timer>
      </Section>
      <Section>
        <CallControls>
          <Control>
            <MuteButton
              aria-label="mute microphone"
              onClick={handleMuteClick}
              ignoreThemeOverride={true}
            >
              <MicIcon />
            </MuteButton>
          </Control>
          <Control>
            <CallButton
              aria-label="end call"
              isPrimary={true}
              ignoreThemeOverride={true}
              isDanger={true}
              onClick={onEndCallClicked}
            >
              <PhoneIcon />
            </CallButton>
          </Control>
          <Control />
        </CallControls>
      </Section>
    </Container>
  )
}

EmbeddedVoiceCallInProgressPage.propTypes = {
  callDuration: PropTypes.string,
  onEndCallClicked: PropTypes.func,
  onMuteClick: PropTypes.func
}
export default EmbeddedVoiceCallInProgressPage
