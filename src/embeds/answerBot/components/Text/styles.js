import styled from 'styled-components'

import { zdColorWhite, zdColorOil, zdColorAntiFlashWhite } from '@zendeskgarden/css-variables'
import { MessageBubble } from 'component/shared/MessageBubble'

const Container = styled.div`
  ${props => {
    return `
      margin-bottom: ${7 / props.theme.fontSize}rem;
      ${props.isVisitor ? userMessage(props) : botMessage(props)}
    `
  }}
`

const userMessage = props => `
  float: ${props.theme.rtl ? 'left' : 'right'};
  color: ${zdColorWhite};
`

const botMessage = props => `
  float: ${props.theme.rtl ? 'right' : 'left'};
  color: ${zdColorOil};
`

const Bubble = styled(MessageBubble)`
  ${props => {
    return `
      ${props.theme.rtl ? 'margin-right' : 'margin-left'}: ${40 / props.theme.fontSize}rem;
      ${props.isVisitor ? userBackground(props) : botBackground(props)}
    `
  }}
`

const userBackground = props => `
  background-color: ${props.theme.buttonColorStr} !important;
  color: ${props.theme.buttonTextColorStr} !important;

  &:hover,
  &:active,
  &:focus {
    background-color: ${props.theme.buttonHighlightColorStr} !important;
  }
`

const botBackground = props => `
  background: ${zdColorAntiFlashWhite};
  max-width: ${219 / props.theme.fontSize}rem !important;
`

export { Container, Bubble }
