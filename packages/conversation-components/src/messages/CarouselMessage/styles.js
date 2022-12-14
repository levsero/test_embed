import { rgba, rem, math } from 'polished'
import styled, { css } from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import dirStyles from 'src/utils/dirStyles'

// This should be roughly the same width as the avatar slide
// This means avatar left padding + avatar size + space before first slide
// It is hard coded here, since this value is needed in JS for the scroll behaviour as well
export const scrollPadding = (props) => rem(52, props.theme.baseFontSize)

const SlideMessage = styled.div`
  font-family: ${(props) => props.theme.messenger.fontFamily};
  position: relative;
  margin-top: ${(props) => props.theme.messenger.space.sm};
`

const Slides = styled.div`
  display: flex;
  align-items: stretch;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scroll-padding: ${scrollPadding};

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Slide = styled.div`
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: calc(
    100% - ${scrollPadding} - ${(props) => rem(64, props.theme.messenger.baseFontSize)}
  );
  max-width: ${(props) => rem(280, props.theme.messenger.baseFontSize)};
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
  margin-${dirStyles.right}: ${(props) => props.theme.messenger.space.xs};


  ${(props) =>
    props.isOnlySlide &&
    css`
    margin-${dirStyles.right}: 0;
  `}
`

const BufferSlide = styled(Slide)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 12.5%;
  margin-${dirStyles.right}: 0;
`

const AvatarSlide = styled(Slide)`
  margin-${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen};
  padding-${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen}
  max-width: none;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  margin-${dirStyles.right}: 0;
`

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  padding: ${(props) => props.theme.messenger.space.sixteen};
  border-radius: ${(props) =>
    `${props.theme.messenger.borderRadii.textMessage} ${props.theme.messenger.borderRadii.textMessage} 0 0`};
  border: ${(props) => `${props.theme.borders.sm} ${props.theme.palette.grey[300]}`};

  &,
  * {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`

const Title = styled.div`
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
  font-weight: ${(props) => props.theme.messenger.fontWeights.semibold};
`

const Description = styled.div`
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
  font-weight: normal;
`

const Actions = styled.div``

const Action = styled.a`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  display: block;
  padding: ${(props) => props.theme.messenger.space.sm} 0;
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  text-align: center;

  border: ${(props) => `${props.theme.borders.sm} ${props.theme.palette.grey[300]}`};
  border-top: 0;

  border-radius: ${(props) =>
    props.isLastAction
      ? `
    0 0 ${props.theme.messenger.borderRadii.textMessage} ${props.theme.messenger.borderRadii.textMessage}
  `
      : 0};

  &,
  &:hover,
  &:focus {
    text-decoration: none;
    color: ${(props) => props.theme.messenger.colors.action};
  }

  &:hover {
    background-color: ${(props) => rgba(props.theme.messenger.colors.action, 0.08)};
  }

  &:focus {
    box-shadow: inset
      ${(props) => props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
  }
`

const ControlButton = styled(IconButton)`
  &&& {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: ${(props) => props.theme.messenger.space.xl};
    width: ${(props) => props.theme.messenger.space.xl};
    background-color: ${(props) => props.theme.palette.white};
    z-index: 1;
    box-shadow: 0px 1px 4px 0px rgba(71, 69, 123, 0.04), 0px 4px 12px 0px rgba(36, 36, 36, 0.1);

    svg {
      height: ${(props) => props.theme.messenger.iconSizes.md};
      width: ${(props) => props.theme.messenger.iconSizes.md};
    }

    border-width: 3px;
    border-style: solid;
    border-color: transparent;

    &[data-garden-focus-visible] {
      border: 3px solid ${(props) => rgba(props.theme.messenger.colors.action, 0.35)};
    }
  }
`

const NextButton = styled(ControlButton)`
  &&& {
    ${dirStyles.right}: ${(props) => props.theme.messenger.space.sixteen};

    ${dirStyles.ltrOnly('transform: translateY(-50%) scaleX(-1);')}
  }
`

const PreviousButton = styled(ControlButton)`
  &&& {
    ${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen};

    ${dirStyles.rtlOnly('transform: translateY(-50%) scaleX(-1);')}
`

const Heading = styled.div`
  margin-${dirStyles.left}: ${(props) =>
  math(`${props.theme.messenger.space.sixteen} + ${props.theme.messenger.space.xxs}`)};
`

export {
  SlideMessage,
  Slides,
  Slide,
  Title,
  Description,
  Actions,
  Content,
  Action,
  BufferSlide,
  AvatarSlide,
  NextButton,
  PreviousButton,
  Heading,
}
