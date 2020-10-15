import styled from 'styled-components'
import { MESSAGE_BUBBLE_SHAPES } from 'src/apps/messenger/features/sunco-components/constants'

const getRadius = props => props.theme.messenger.borderRadii.textMessage

const Image = styled.img`
  width: ${props => props.theme.messenger.space.imageWidth};
  height: ${props => props.theme.messenger.space.imageHeight};
  object-fit: cover;
`

const PrimaryParticipantImage = styled(Image)`
  ${props => {
    const radius = getRadius(props)
    switch (props.shape) {
      case MESSAGE_BUBBLE_SHAPES.standalone:
        if (props.hasText) return `border-radius: ${radius} ${radius} 0 0;`
        return `border-radius: ${radius};`

      case MESSAGE_BUBBLE_SHAPES.first:
        if (props.hasText) return `border-radius: ${radius} ${radius} 0 0;`
        return `border-radius: ${radius} ${radius} 0;`

      case MESSAGE_BUBBLE_SHAPES.middle:
        if (props.hasText) return `border-radius: ${radius} 0 0 0;`
        return `border-radius: ${radius} 0 0 ${radius};`

      case MESSAGE_BUBBLE_SHAPES.last:
        if (props.hasText) return `border-radius: ${radius} 0 0 0;`
        return `border-radius: ${radius} 0 ${radius} ${radius};`
    }
  }}
`

const OtherParticipantImage = styled(Image)`
  ${props => {
    const radius = getRadius(props)
    switch (props.shape) {
      case MESSAGE_BUBBLE_SHAPES.standalone:
        if (props.hasText) return `border-radius: ${radius} ${radius} 0 0;`
        return `border-radius: ${radius};`

      case MESSAGE_BUBBLE_SHAPES.first:
        if (props.hasText) return `border-radius: ${radius} ${radius} 0 0;`
        return `border-radius: ${radius} ${radius} ${radius} 0;`

      case MESSAGE_BUBBLE_SHAPES.middle:
        if (props.hasText) return `border-radius: 0 ${radius} 0 0;`
        return `border-radius: 0 ${radius} ${radius} 0;`

      case MESSAGE_BUBBLE_SHAPES.last:
        if (props.hasText) return `border-radius: 0 ${radius} 0 0;`
        return `border-radius: 0 ${radius} ${radius} ${radius};`
    }
  }}
`

const Text = styled.p`
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: ${props => props.theme.messenger.fontSizes.md};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  padding: ${props => `${props.theme.messenger.space.xs} ${props.theme.messenger.space.sm}`};

  a {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: ${props => props.theme.messenger.fontSizes.md};
    line-height: ${props => props.theme.messenger.lineHeights.sm};
    color: ${props =>
      props.isPrimaryParticipant
        ? props.theme.messenger.colors.messageText
        : props.theme.messenger.colors.otherParticipantMessageText};
  }
  a &hover {
    text-decoration: underline;
  }
`

export { PrimaryParticipantImage, OtherParticipantImage, Text }
