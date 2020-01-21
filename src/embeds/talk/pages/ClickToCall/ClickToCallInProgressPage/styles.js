import styled from 'styled-components'
import { zdColorGrey800, zdColorRed600, zdColorWhite } from '@zendeskgarden/css-variables'
import { Button } from '@zendeskgarden/react-buttons'
import AgentAvatar from 'src/embeds/talk/icons/widget-icon_avatar.svg'

const HangUpButton = styled(Button)`
  &&& {
    width: 100%;
    background-color: ${zdColorRed600} !important;
    color: ${zdColorWhite} !important;
    border-color: ${zdColorRed600} !important;
  }
`

const Avatar = styled(AgentAvatar)`
  ${props => {
    const fontSize = props.theme.fontSize
    return `
      height: ${70 / fontSize}rem;
      width: ${70 / fontSize}rem;
      margin-bottom: ${10 / fontSize}rem;
    `
  }}
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 90%;
`

const ComponentContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-bottom: ${props => 14 / props.theme.fontSize}rem;
`
const Timer = styled.p`
  color: ${zdColorGrey800};
`

export { Avatar, ComponentContainer, FlexContainer, HangUpButton, Timer }
