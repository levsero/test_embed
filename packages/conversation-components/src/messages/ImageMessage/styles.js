import styled from 'styled-components'

const Image = styled.img`
  height: ${(props) => props.theme.messenger.space.imageHeight};
  object-fit: cover;
  display: block;

  ${(props) =>
    props.status === 'failed' &&
    `
      opacity: 0.66;
    `}
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
      height: ${(props) => props.theme.messenger.space.imageHeight};
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
