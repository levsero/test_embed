import styled, { css } from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import TalkSuccessIcon from 'embeds/talk/icons/talk_success.svg'
import { FONT_SIZE } from 'constants/shared'

const Container = styled.div`
  min-height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow-y: auto;
`

const StyledSuccessIcon = styled(TalkSuccessIcon)`
  min-width: ${160 / FONT_SIZE}rem;
  width: ${160 / FONT_SIZE}rem;
  height: ${80 / FONT_SIZE}rem;

  ${props =>
    props.theme.baseColor &&
    css`
      .customColor {
        fill: ${props.theme.baseColor} !important;
      }
    `}
`

const Heading = styled.h2`
  font-weight: 700;

  &:not(:disabled) {
    color: ${props => props.theme.listColorStr} !important;
    fill: ${props => props.theme.listColorStr} !important;

    &,
    &:hover,
    &:active,
    &:focus {
      color: ${props => props.theme.listHighlightColorStr} !important;
      fill: ${props => props.theme.listHighlightColorStr} !important;
    }
  }
`

const Message = styled.p`
  margin: ${5 / FONT_SIZE}rem;
  color: ${zdColorGrey800};
`

export { Container, StyledSuccessIcon as SuccessIcon, Heading, Message }
