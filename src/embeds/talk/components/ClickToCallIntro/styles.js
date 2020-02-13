import styled from 'styled-components'

import ClickToCallIcon from 'src/embeds/talk/icons/click_to_call.svg'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: ${props => 14 / props.theme.fontSize}rem;
`

const StyledClickToCallIcon = styled(ClickToCallIcon)`
  min-width: ${props => 60 / props.theme.fontSize}rem;
  min-height: ${props => 60 / props.theme.fontSize}rem;
  height: ${props => 60 / props.theme.fontSize}rem;
  width: ${props => 60 / props.theme.fontSize}rem;
  margin-bottom: ${props => 20 / props.theme.fontSize}rem !important;
  flex-shrink: 0;

  path.customColor,
  rect.customColor {
    fill: ${props => props.theme.listColorStr} !important;
  }
`

const Message = styled.p`
  margin-bottom: ${props => 20 / props.theme.fontSize}rem !important;
  text-align: center;
  font-size: ${props => 14 / props.theme.fontSize}rem !important;
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

export { Container, StyledClickToCallIcon as ClickToCallIcon, Message, FlexContainer, PageContents }
