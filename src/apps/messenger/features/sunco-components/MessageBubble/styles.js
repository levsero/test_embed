import styled from 'styled-components'
import { rem } from 'polished'

import {
  MESSAGE_BUBBLE_SHAPES,
  MESSAGE_STATUS
} from 'src/apps/messenger/features/sunco-components/constants'

const getRadius = props => props.theme.messenger.borderRadii.textMessage
const primaryMessageExtraSpace = props => rem(80, props.theme.messenger.baseFontSize)
const otherMessageExtraSpace = props => rem(64, props.theme.messenger.baseFontSize)
const avatarSpace = props => rem(36, props.theme.messenger.baseFontSize)

const Bubble = styled.div`
  margin-top: ${props => props.theme.messenger.space.xxxs};
  min-width: ${props => props.theme.messenger.space.xl};
  min-height: ${props => props.theme.messenger.space.xl};
  display: flex;
  flex-direction: column;
  justify-content: center;
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
`

export { PrimaryParticipantBubble, OtherParticipantBubble }
