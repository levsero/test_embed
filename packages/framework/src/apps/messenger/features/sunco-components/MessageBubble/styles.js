import styled, { keyframes } from 'styled-components'
import { rem } from 'polished'

import {
  MESSAGE_BUBBLE_SHAPES,
  MESSAGE_STATUS
} from 'src/apps/messenger/features/sunco-components/constants'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import messageSteps, {
  animation,
  transition
} from 'src/apps/messenger/features/sunco-components/Animated/messageSteps'

const getRadius = props => props.theme.messenger.borderRadii.textMessage
const primaryMessageExtraSpace = rem(80, baseFontSize)
const otherMessageExtraSpace = rem(64, baseFontSize)
const avatarSpace = rem(36, baseFontSize)

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
  min-width: ${props => props.theme.messenger.space.xl};

  transition: ${transition(messageSteps.messageBorder, 'border-radius')},
    ${transition(messageSteps.messageStatusOpacity, 'opacity')};
`

const PrimaryParticipantBubble = styled(Bubble)`
  background-color: ${props => props.theme.messenger.colors.message};
  color: ${props => props.theme.messenger.colors.messageText};
  border: 0;
  max-width: calc(100% - ${primaryMessageExtraSpace});

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
  border-color: ${props => props.theme.messenger.colors.otherParticipantMessageBorder};
  background-color: ${props => props.theme.messenger.colors.otherParticipantMessage};
  color: ${props => props.theme.messenger.colors.otherParticipantMessageText};
  max-width: calc(100% - ${avatarSpace} - ${otherMessageExtraSpace});

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
