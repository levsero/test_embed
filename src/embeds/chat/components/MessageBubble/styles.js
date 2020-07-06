import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { zdColorGrey200, zdColorBlue400 } from '@zendeskgarden/css-variables'
import { Anchor } from '@zendeskgarden/react-buttons'

const Container = styled.div`
  &&& {
    display: flex;
    flex-direction: column;
  }
`

const MessageContainer = styled.div`
  display: inline-block;
  white-space: pre-wrap;
  word-wrap: break-word !important;

  border-radius: ${props => 16 / props.theme.fontSize}rem;
  line-height: ${props => 16 / props.theme.fontSize}rem;
  padding: ${props => 8 / props.theme.fontSize}rem ${props => 12 / props.theme.fontSize}rem;
  max-width: ${props => 245 / props.theme.fontSize}rem;

  ${props =>
    !props.isAgent &&
    `
    background-color: ${props.theme.buttonColorStr} !important;

    &, a {
      color: ${props.theme.buttonTextColorStr} !important;
    }
  `}

  ${props =>
    props.isAgent &&
    `
      background-color: ${zdColorGrey200};
      max-width: ${219 / props.theme.fontSize}rem !important;
  `}


  ${props =>
    props.hasOptions &&
    `
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: ${1 / props.theme.fontSize}rem #f3f3f3 solid;
  `}
`

const Message = styled.span``

const TranslateLink = styled(Button).attrs(() => ({
  isLink: true,
  ignoreThemeOverride: true
}))`
  &&& {
    margin-left: ${props => 5 / props.theme.fontSize}rem;
    transition: 100ms ease;
    border-bottom: ${props => 1 / props.theme.fontSize}rem solid transparent;
    background-color: transparent;

    [dir='rtl'] & {
      margin-right: ${props => 5 / props.theme.fontSize}rem;
      margin-left: 0;
    }

    &:hover {
      border-color: ${zdColorBlue400};
      cursor: pointer;
      text-decoration: none !important;
    }
  }
`

const MessageBubbleLink = styled(Anchor).attrs(() => ({ ignoreThemeOverride: true }))``

export { Container, MessageContainer, TranslateLink, Message, MessageBubbleLink }
