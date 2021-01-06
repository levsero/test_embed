import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { getMicrophoneMuted, getTimeInCall } from 'src/embeds/talk/selectors'
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

const parseTime = time => {
  const hours = Math.floor(time / 3600) || ''
  const minutes = Math.floor((time - hours * 3600) / 60)
  const seconds = time % 60

  return `${hours > 0 ? `${hours}:` : ''}${
    minutes > 0 ? `${minutes >= 10 ? minutes : `0${minutes}`}` : '00'
  }:${seconds >= 10 ? seconds : `0${seconds}`}`
}

const CallInProgress = ({ onEndCallClicked = () => {}, onMuteClick = () => {}, isCallActive }) => {
  const dispatch = useDispatch()
  const isMuted = useSelector(getMicrophoneMuted)
  const timeInCall = useSelector(getTimeInCall)
  const timeLabel = parseTime(timeInCall)

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
        <Timer>{timeLabel}</Timer>
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
  onEndCallClicked: PropTypes.func.isRequired,
  onMuteClick: PropTypes.func,
  isCallActive: PropTypes.bool
}

export default CallInProgress
