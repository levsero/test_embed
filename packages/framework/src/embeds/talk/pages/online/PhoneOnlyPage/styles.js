import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import TalkIcon from 'src/embeds/talk/icons/talk.svg'
import { isMobileBrowser } from 'src/util/devices'

const Container = styled.div`
  text-align: center;
  font-size: ${14 / FONT_SIZE}rem !important;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ${isMobileBrowser() &&
  `
      line-height: ${20 / FONT_SIZE}rem;
      font-size: ${15 / FONT_SIZE}rem};
    `}

  &:not(:disabled) {
    svg,
    svg path {
      fill: ${(props) => props.theme.listColorStr} !important;
    }
  }
`

const StyledTalkIcon = styled(TalkIcon)`
  min-width: ${50 / FONT_SIZE}rem;
  min-height: ${50 / FONT_SIZE}rem;
  height: ${50 / FONT_SIZE}rem;
  width: ${50 / FONT_SIZE}rem;

  path.customColor,
  rect.customColor {
    fill: ${(props) => props.theme.listColorStr} !important;
  }
`

const Message = styled.p`
  width: 100%;
  margin-top: ${20 / FONT_SIZE}rem !important;
  margin-bottom: ${10 / FONT_SIZE}rem !important;
  text-align: center;
`

const PhoneNumberContainer = styled.div`
  text-align: center;
  font-size: ${20 / FONT_SIZE}rem;

  a,
  a span {
    color: ${(props) => props.theme.linkColorStr} !important;
  }
  a:hover {
    color: ${(props) => props.theme.linkTextColorStr} !important;
  }
`

export { Container, StyledTalkIcon as TalkIcon, Message, PhoneNumberContainer }
