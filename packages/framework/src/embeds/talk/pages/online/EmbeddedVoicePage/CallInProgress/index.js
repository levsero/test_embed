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

const CallInProgress = ({
  callDuration = '30:00',
  onEndCallClicked = () => {},
  onMuteClick = () => {},
  isCallActive
}) => {
  const dispatch = useDispatch()
  const isMuted = useSelector(getMicrophoneMuted)

  const handleMuteClick = () => {
    if (!isCallActive) {
      return
    }

    if (isMuted) {
      dispatch(unmuteMicrophone())
      onMuteClick(false)
    } else {
      dispatch(muteMicrophone())
      onMuteClick(true)
    }
  }

  const handleEndCallClicked = () => {
    if (!isCallActive) {
      return
    }

    onEndCallClicked()
  }

  const MicIcon = isMuted ? MutedMicrophoneIcon : MicrophoneIcon

  return (
    <Container>
      <Section>
        <Label>{isCallActive ? 'Call in progress' : 'Call ended'}</Label>
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
              onClick={handleEndCallClicked}
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

CallInProgress.propTypes = {
  callDuration: PropTypes.string,
  onEndCallClicked: PropTypes.func.isRequired,
  onMuteClick: PropTypes.func,
  isCallActive: PropTypes.bool
}

export default CallInProgress
