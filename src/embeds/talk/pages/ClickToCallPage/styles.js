import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'
import ClickToCallIcon from 'src/embeds/talk/icons/click_to_call.svg'
import { Button } from '@zendeskgarden/react-buttons'

const CallButton = styled(Button)`
  width: 100%;
  margin-top: auto;
  margin-bottom: ${20 / FONT_SIZE}rem !important;
  flex-shrink: 0;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledClickToCallIcon = styled(ClickToCallIcon)`
  min-width: ${60 / FONT_SIZE}rem;
  min-height: ${60 / FONT_SIZE}rem;
  height: ${60 / FONT_SIZE}rem;
  width: ${60 / FONT_SIZE}rem;
  margin-bottom: ${20 / FONT_SIZE}rem !important;
  flex-shrink: 0;

  path.customColor,
  rect.customColor {
    fill: ${props => props.theme.listColorStr} !important;
  }
`

const Message = styled.p`
  margin-bottom: ${20 / FONT_SIZE}rem !important;
  text-align: center;
  font-size: ${14 / FONT_SIZE}rem !important;
`

const PageContents = styled.div`
  min-height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const FlexContainer = styled.div`
  flex: 1;
`

export {
  Container,
  StyledClickToCallIcon as ClickToCallIcon,
  Message,
  CallButton,
  FlexContainer,
  PageContents
}
