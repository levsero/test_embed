import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'
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
  Timer,
} from './styles'

const parseTime = (time) => {
  const hours = Math.floor(time / 3600) || ''
  const minutes = Math.floor((time - hours * 3600) / 60)
  const seconds = time % 60

  return `${hours > 0 ? `${hours}:` : ''}${
    minutes > 0 ? `${minutes >= 10 ? minutes : `0${minutes}`}` : '00'
  }:${seconds >= 10 ? seconds : `0${seconds}`}`
}

const translatedCallLabel = (translate, isCallInProgress, hasLastCallFailed) => {
  if (hasLastCallFailed)
    return translate('embeddable_framework.talk.embeddedVoice.callErrors.callFailed')
  return isCallInProgress
    ? translate('embeddable_framework.talk.embeddedVoice.call_in_progress')
    : translate('embeddable_framework.talk.embeddedVoice.call.ended')
}

const CallInProgress = ({
  onEndCallClicked = () => {},
  onMuteClick = () => {},
  isCallInProgress = true,
  hasLastCallFailed = false,
}) => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const isMuted = useSelector(getMicrophoneMuted)
  const label = translatedCallLabel(translate, isCallInProgress, hasLastCallFailed)
  const timeInCall = useSelector(getTimeInCall)
  const timeLabel = parseTime(timeInCall)

  const handleMuteClick = () => {
    if (!isCallInProgress) {
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
    if (!isCallInProgress) {
      return
    }

    onEndCallClicked()
  }

  const MicIcon = isMuted ? MutedMicrophoneIcon : MicrophoneIcon

  return (
    <Container>
      <Section>
        <Label>{label}</Label>
        <Timer>{timeLabel}</Timer>
      </Section>
      <Section>
        <CallControls>
          <Control>
            <MuteButton
              aria-label={translate(
                'embeddable_framework.talk.embeddedVoice.callInProgress.button.muteMicrophone'
              )}
              onClick={handleMuteClick}
              ignoreThemeOverride={true}
            >
              <MicIcon />
            </MuteButton>
          </Control>
          <Control>
            <CallButton
              aria-label={translate(
                'embeddable_framework.talk.clickToCall.callInProgress.button.endCall'
              )}
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
  isCallInProgress: PropTypes.bool,
  hasLastCallFailed: PropTypes.bool,
}

export default CallInProgress
