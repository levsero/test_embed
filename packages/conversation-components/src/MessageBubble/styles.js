import styled, { keyframes } from 'styled-components'
import { rem } from 'polished'

import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS } from 'src/constants'
import messageSteps, { animation, transition } from 'src/animations/messageSteps'

const getRadius = props => props.theme.messenger.borderRadii.textMessage

const messageEnter = keyframes`
       0% { transform: translateY(0%) translateX(50%) scale(0); }
      50% { transform: translateY(-4%) translateX(-1%) scale(1); }
      100% { transform: translateY(0%) translateX(0%) scale(1); }
    `
const otherMessageEnter = keyframes`
       0% { transform: translateY(0%) translateX(-50%) scale(0); }
      50% { transform: translateY(-4%) translateX(1%) scale(1); }
      100% { transform: translateY(0%) translateX(0%) scale(1); }
    `

const Bubble = styled.div`
  margin-top: ${props => props.theme.messenger.space.xxxs};
  min-width: ${props => props.theme.messenger.space.messageBubbleWidth};

  transition: ${transition(messageSteps.messageBorder, 'border-radius')},
    ${transition(messageSteps.messageStatusOpacity, 'opacity')};
`

const PrimaryParticipantBubble = styled(Bubble)`
  font-family: ${props => props.theme.messenger.fontFamily};
  background-color: ${props => props.theme.messenger.colors.message};
  color: ${props => props.theme.messenger.colors.messageText};
  border: 0;
  max-width: calc(100% - ${props => rem(80, props.theme.messenger.baseFontSize)});

  ${props => {
    const radius = getRadius(props)
    switch (props.shape) {
      case MESSAGE_BUBBLE_SHAPES.standalone:
        return `border-radius: ${radius};`
      case MESSAGE_BUBBLE_SHAPES.first:
        return `border-radius: ${radius} ${radius} 0;`
      case MESSAGE_BUBBLE_SHAPES.middle:
        return `border-radius: ${radius} 0 0 ${radius};`
      case MESSAGE_BUBBLE_SHAPES.last:
        return `border-radius: ${radius} 0 ${radius} ${radius};`
    }
  }}


  animation: ${props =>
    props.isFreshMessage ? animation(messageSteps.messageEnter, messageEnter) : 'none'};

  ${props =>
    props.status === MESSAGE_STATUS.sending &&
    `
      opacity: 0.5;
  `}

  ${props =>
    props.status === MESSAGE_STATUS.failed &&
    `
      opacity: 0.5;
      background-color: ${props.theme.palette.red[400]};
      color: ${props.theme.palette.white};
  `}
`

const OtherParticipantBubble = styled(Bubble)`
  font-family: ${props => props.theme.messenger.fontFamily};
  border-color: ${props => props.theme.messenger.colors.otherParticipantMessageBorder};
  background-color: ${props => props.theme.messenger.colors.otherParticipantMessage};
  color: ${props => props.theme.messenger.colors.otherParticipantMessageText};
  max-width: calc(100% - ${props => rem(36, props.theme.messenger.baseFontSize)} - ${props =>
  rem(64, props.theme.messenger.baseFontSize)});

  ${props => {
    const radius = getRadius(props)
    switch (props.shape) {
      case MESSAGE_BUBBLE_SHAPES.standalone:
        return `border-radius: ${radius};`
      case MESSAGE_BUBBLE_SHAPES.first:
        return `border-radius: ${radius} ${radius} ${radius} 0;`
      case MESSAGE_BUBBLE_SHAPES.middle:
        return `border-radius: 0 ${radius} ${radius} 0;`
      case MESSAGE_BUBBLE_SHAPES.last:
        return `border-radius: 0 ${radius} ${radius} ${radius};`
    }
  }}

  animation: ${props =>
    props.isFreshMessage ? animation(messageSteps.messageEnter, otherMessageEnter) : 'none'};
`

export { PrimaryParticipantBubble, OtherParticipantBubble }
