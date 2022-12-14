import styled, { css } from 'styled-components'
import MessageBubble from 'src/MessageBubble'
import messageSteps, { transition } from 'src/animations/messageSteps'
import { MESSAGE_STATUS } from 'src/constants'

const Image = styled.img`
  height: ${(props) => props.theme.messenger.space.imageHeight};
  object-fit: cover;
  display: block;
  transition: ${transition(messageSteps.messageColor, 'opacity')};
`

const PrimaryParticipantImage = styled(Image)`
  width: ${(props) => props.theme.messenger.space.primaryImageWidth};
`

const OtherParticipantImage = styled(Image)`
  width: ${(props) => props.theme.messenger.space.otherImageWidth};
`

const OpenImageText = styled.div`
  display: none;
  position: absolute;
  top: calc(${(props) => props.theme.messenger.space.imageHeight} / 2);
  justify-content: center;
  color: #fff;
  width: 100%;
  z-index: 1;
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.sm};
`

const ImageContainerLink = styled.a`
  ${(props) =>
    props.href &&
    css`
      &:hover,
      &:focus {
        ${OpenImageText} {
          display: flex;
        }

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1;

          // hack to get safari to respect the overflow: hidden on the
          // message bubble
          transform: translateZ(0);
        }
      }
    `}
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

const ImageMessageBubble = styled(MessageBubble)`
  ${(props) =>
    props.status === MESSAGE_STATUS.sent &&
    css`
      && {
        background-color: transparent;
      }
    `}

  ${(props) =>
    props.status === MESSAGE_STATUS.sending &&
    css`
      && {
        opacity: 1;

        ${Image} {
          opacity: ${props.theme.messenger.opacity.sendingMessageStatus};
        }
      }
    `}

  ${(props) =>
    props.status === MESSAGE_STATUS.failed &&
    css`
      && {
        opacity: 1;

        ${Image} {
          opacity: ${props.theme.messenger.opacity.failedImageMessageStatus};
        }
      }
    `}
`

export {
  PrimaryParticipantImage,
  OtherParticipantImage,
  Text,
  OpenImageText,
  ImageContainerLink,
  ImageMessageBubble,
}
