import { rem } from 'polished'
import styled, { keyframes } from 'styled-components'
import messageSteps, { animation, transition } from 'src/animations/messageSteps'
import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS, MESSAGE_TYPES } from 'src/constants'
import dirStyles from 'src/utils/dirStyles'

const getRadius = (props) => props.theme.messenger.borderRadii.textMessage

const enterFromRight = keyframes`
       0% { transform: translateY(0%) translateX(50%) scale(0); }
      50% { transform: translateY(-4%) translateX(-1%) scale(1); }
      100% { transform: translateY(0%) translateX(0%) scale(1); }
    `
const enterFromLeft = keyframes`
       0% { transform: translateY(0%) translateX(-50%) scale(0); }
      50% { transform: translateY(-4%) translateX(1%) scale(1); }
      100% { transform: translateY(0%) translateX(0%) scale(1); }
    `

const Bubble = styled.div`
  margin-top: ${(props) => props.theme.messenger.space.xxxs};
  min-width: ${(props) => props.theme.messenger.space.messageBubbleWidth};

  transition: ${transition(messageSteps.messageBorder, 'border-radius')},
    ${transition(messageSteps.messageStatusOpacity, 'opacity')},
    ${transition(messageSteps.messageColor, 'background-color')};
  overflow: hidden;
`

const PrimaryParticipantBubble = styled(Bubble)`
  margin-top: ${(props) => {
    switch (props.shape) {
      case MESSAGE_BUBBLE_SHAPES.first:
      case MESSAGE_BUBBLE_SHAPES.standalone:
        return props.theme.messenger.space.sm
      default:
        return props.theme.messenger.space.xxxs
    }
  }};
  font-family: ${(props) => props.theme.messenger.fontFamily};
  background-color: ${(props) => props.theme.messenger.colors.message};
  color: ${(props) => props.theme.messenger.colors.messageText};
  border: 0;
  max-width: calc(100% - ${(props) => rem(80, props.theme.messenger.baseFontSize)});

  ${(props) => {
    const radius = getRadius(props)
    switch (props.shape) {
      case MESSAGE_BUBBLE_SHAPES.standalone:
        return `border-radius: ${radius};`
      case MESSAGE_BUBBLE_SHAPES.first:
        return dirStyles.borderRadius(radius, radius, 0, radius)
      case MESSAGE_BUBBLE_SHAPES.middle:
        return dirStyles.borderRadius(radius, 0, 0, radius)
      case MESSAGE_BUBBLE_SHAPES.last:
        return dirStyles.borderRadius(radius, 0, radius, radius)
    }
  }}

  animation: ${(props) =>
    props.isFreshMessage
      ? animation(messageSteps.messageEnter, dirStyles.swap(enterFromRight, enterFromLeft)(props))
      : 'none'};

  ${(props) =>
    props.status === MESSAGE_STATUS.sending &&
    `
      opacity: ${props.theme.messenger.opacity.sendingMessageStatus};
    `}

  ${(props) =>
    props.status === MESSAGE_STATUS.failed &&
    `
      background-color: ${props.theme.messenger.colors.failedMessage};
      color: ${props.theme.messenger.colors.failedMessageText};
  `}

    ${(props) =>
    props.status === MESSAGE_STATUS.failed &&
    props.type === MESSAGE_TYPES.image &&
    `
      background-color: ${props.theme.messenger.colors.failedImageMessage};
    `}
`

const OtherParticipantBubble = styled(Bubble)`
  font-family: ${(props) => props.theme.messenger.fontFamily};
  border-color: ${(props) => props.theme.messenger.colors.otherParticipantMessageBorder};
  background-color: ${(props) => props.theme.messenger.colors.otherParticipantMessage};
  color: ${(props) => props.theme.messenger.colors.otherParticipantMessageText};
  max-width: calc(
    100% - ${(props) => rem(36, props.theme.messenger.baseFontSize)} -
      ${(props) => rem(64, props.theme.messenger.baseFontSize)}
  );

  ${(props) => {
    const radius = getRadius(props)
    switch (props.shape) {
      case MESSAGE_BUBBLE_SHAPES.standalone:
        return `border-radius: ${radius};`
      case MESSAGE_BUBBLE_SHAPES.first:
        return dirStyles.borderRadius(radius, radius, radius, 0)
      case MESSAGE_BUBBLE_SHAPES.middle:
        return dirStyles.borderRadius(0, radius, radius, 0)
      case MESSAGE_BUBBLE_SHAPES.last:
        return dirStyles.borderRadius(0, radius, radius, radius)
    }
  }}

  animation: ${(props) =>
    props.isFreshMessage
      ? animation(messageSteps.messageEnter, dirStyles.swap(enterFromLeft, enterFromRight)(props))
      : 'none'};
`

export { PrimaryParticipantBubble, OtherParticipantBubble }
