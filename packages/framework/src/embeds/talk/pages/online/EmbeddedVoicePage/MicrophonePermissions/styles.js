import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import EmbeddedVoiceIcon from 'src/embeds/talk/icons/embedded_voice.svg'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${(props) => 14 / props.theme.fontSize}rem !important;
  align-items: center;
  justify-content: center;
  min-height: 70%;
  width: 100%;
  height: 100%;
  min-height: ${(props) => 300 / props.theme.fontSize}rem;
`

const TopSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 60%;
  justify-content: center;
  width: 100%;
  text-align: center;
`

const BottomSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 40%;
  justify-content: center;
  width: 100%;
  text-align: center;
`

const StyledEmbeddedVoiceIcon = styled(EmbeddedVoiceIcon)`
  min-width: ${(props) => 60 / props.theme.fontSize}rem;
  min-height: ${(props) => 60 / props.theme.fontSize}rem;
  height: ${(props) => 60 / props.theme.fontSize}rem;
  width: ${(props) => 60 / props.theme.fontSize}rem;
  margin-bottom: ${(props) => 20 / props.theme.fontSize}rem !important;
  flex-shrink: 0;
  path.customColor,
  rect.customColor {
    fill: ${(props) => props.theme.iconColor} !important;
  }
`

const Message = styled.p`
  align-self: center;
  text-align: center;
  margin-top: ${(props) => 24 / props.theme.fontSize}rem !important;
  line-height: ${(props) => 20 / props.theme.fontSize}rem;
  color: rgb(47, 57, 65);
  width: 85%;
`

const StyledButton = styled(Button)`
  width: ${(props) => 160 / props.theme.fontSize}rem;
`

const Dot = styled.span`
  height: ${(props) => 8 / props.theme.fontSize}rem;
  width: ${(props) => 8 / props.theme.fontSize}rem;
  background-color: ${(props) => (props.isActive ? '#007a7c' : 'rgba(0, 0, 0, .32)')};
  border-radius: 50%;
  display: inline-block;
`

const DotContainer = styled.div`
  margin-top: ${(props) => 32 / props.theme.fontSize}rem !important;
  display: flex;
  flex-direction: row;
  > *:not(:first-child) {
    margin-left: ${(props) => 8 / props.theme.fontSize}rem;
  }
`

export {
  StyledButton as Button,
  StyledEmbeddedVoiceIcon as EmbeddedVoiceIcon,
  Container,
  Dot,
  DotContainer,
  Message,
  TopSectionContainer,
  BottomSectionContainer,
}
