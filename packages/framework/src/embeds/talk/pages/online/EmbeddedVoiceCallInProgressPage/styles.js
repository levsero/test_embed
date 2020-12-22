import styled from 'styled-components'
import PhoneStroke from '@zendeskgarden/svg-icons/src/12/phone-stroke.svg'
import MicrophoneStroke from '@zendeskgarden/svg-icons/src/12/microphone-on-stroke.svg'
import MicrophoneOffStroke from '@zendeskgarden/svg-icons/src/12/microphone-off-stroke.svg'
import { IconButton } from '@zendeskgarden/react-buttons'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: ${props => 14 / props.theme.fontSize}rem;
`
const Section = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Label = styled.h3`
  align-self: center;
`
const Timer = styled.h1`
  margin-top: ${props => 8 / props.theme.fontSize}rem;
  align-self: center;
`

const CallControls = styled.div`
  display: flex;
  flex-direction: row;
`

const Control = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`
const PhoneIcon = styled(PhoneStroke)``

const MicrophoneIcon = styled(MicrophoneStroke)``

const MutedMicrophoneIcon = styled(MicrophoneOffStroke)``

const StyledIconButton = styled(IconButton)`
  width: ${props => 64 / props.theme.fontSize}rem;
  height: ${props => 64 / props.theme.fontSize}rem !important;
  svg {
    width: ${props => 24 / props.theme.fontSize}rem !important;
    height: ${props => 24 / props.theme.fontSize}rem !important;
    margin: auto;
  }
`

const MuteButton = styled(StyledIconButton)`
  &:hover {
    background-color: ${props => props.theme.baseHighlightColor};
    color: ${props => props.theme.buttonTextColorStr};
  }

  &[data-garden-focus-visible] {
    box-shadow: 0 0 0 3px ${props => props.theme.headerFocusRingColorStr};
  }

  &:active {
    background-color: ${props => props.theme.buttonColorStr};
    color: ${props => props.theme.buttonTextColorStr};
  }

  color: ${props => props.theme.buttonColorStr};
`
export {
  CallControls,
  Control,
  StyledIconButton as CallButton,
  Container,
  Label,
  MicrophoneIcon,
  MuteButton,
  MutedMicrophoneIcon,
  PhoneIcon,
  Section,
  Timer
}
