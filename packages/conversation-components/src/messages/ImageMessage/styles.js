import styled from 'styled-components'
import { MESSAGE_BUBBLE_SHAPES } from 'src/constants'
import dirStyles from 'src/utils/dirStyles'

const getRadius = (props) => props.theme.messenger.borderRadii.textMessage

const Image = styled.img`
  height: ${(props) => props.theme.messenger.space.imageHeight};
  object-fit: cover;
  display: block;
`

const radiusForShapePrimary = (props) => {
  const radius = getRadius(props)
  switch (props.shape) {
    case MESSAGE_BUBBLE_SHAPES.standalone:
      if (props.hasText) {
        return dirStyles.borderRadius(radius, radius, 0, 0)
      }

      return `border-radius: ${radius};`

    case MESSAGE_BUBBLE_SHAPES.first:
      if (props.hasText) {
        return dirStyles.borderRadius(radius, radius, 0, 0)
      }

      return dirStyles.borderRadius(radius, 0, radius, 0)

    case MESSAGE_BUBBLE_SHAPES.middle:
      if (props.hasText) {
        return dirStyles.borderRadius(radius, 0, 0, 0)
      }

      return dirStyles.borderRadius(radius, 0, 0, radius)

    case MESSAGE_BUBBLE_SHAPES.last:
      if (props.hasText) {
        return dirStyles.borderRadius(radius, 0, 0, 0)
      }
      return dirStyles.borderRadius(radius, 0, radius, radius)
  }
}

const PrimaryParticipantImage = styled(Image)`
  width: ${(props) => props.theme.messenger.space.primaryImageWidth};
  ${(props) => radiusForShapePrimary(props)}
`

const radiusForShapeOther = (props) => {
  const radius = getRadius(props)
  switch (props.shape) {
    case MESSAGE_BUBBLE_SHAPES.standalone:
      if (props.hasText) {
        return dirStyles.borderRadius(radius, radius, 0, 0)
      }
      return `border-radius: ${radius};`

    case MESSAGE_BUBBLE_SHAPES.first:
      if (props.hasText) {
        return dirStyles.borderRadius(radius, radius, 0, 0)
      }

      return dirStyles.borderRadius(radius, radius, radius, 0)

    case MESSAGE_BUBBLE_SHAPES.middle:
      if (props.hasText) {
        return dirStyles.borderRadius(0, radius, 0, 0)
      }
      return dirStyles.borderRadius(0, radius, radius, 0)

    case MESSAGE_BUBBLE_SHAPES.last:
      if (props.hasText) {
        return dirStyles.borderRadius(0, radius, 0, 0)
      }

      return dirStyles.borderRadius(0, radius, radius, radius)
  }
}

const OtherParticipantImage = styled(Image)`
  width: ${(props) => props.theme.messenger.space.imageWidth};
  ${(props) => radiusForShapeOther(props)}
`

const OpenImageText = styled.p`
  display: none;
  position: absolute;
  top: calc(${(props) => props.theme.messenger.space.imageHeight} / 2);
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  width: 100%;
  z-index: 1;

  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.sm};
`

const ImageContainerLink = styled.a`
  &:hover,
  &:focus {
    p {
      display: block;
    }

    &:before {
      ${(props) => {
        return props.isPrimaryParticipant
          ? radiusForShapePrimary(props)
          : radiusForShapeOther(props)
      }}
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
      z-index: 1;
      height: ${(props) => props.theme.messenger.space.imageHeight};
      overflow: hidden;
    }
  }
`

const Text = styled.p`
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
  padding: ${(props) => `${props.theme.messenger.space.xs} ${props.theme.messenger.space.sm}`};

  a {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: ${(props) => props.theme.messenger.fontSizes.md};
    line-height: ${(props) => props.theme.messenger.lineHeights.sm};
    color: ${(props) =>
      props.isPrimaryParticipant
        ? props.theme.messenger.colors.messageText
        : props.theme.messenger.colors.otherParticipantMessageText};
  }
  a &hover {
    text-decoration: underline;
  }
`

export { PrimaryParticipantImage, OtherParticipantImage, Text, OpenImageText, ImageContainerLink }
