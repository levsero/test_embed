import styled from 'styled-components'
import { rgba, rem, math } from 'polished'
import { IconButton } from '@zendeskgarden/react-buttons'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'

// This should be roughly the same width as the avatar slide
// This means avatar left padding + avatar size + space before first slide
// It is hard coded here, since this value is needed in JS for the scroll behaviour as well
export const scrollPadding = rem(52, baseFontSize)

const SlideMessage = styled.div`
  position: relative;
  margin-top: ${props => props.theme.messenger.space.sm};
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
  flex: 0 0 calc(100% - ${scrollPadding} - ${rem(64, baseFontSize)});
  max-width: ${rem(280, baseFontSize)};
  display: flex;
  flex-direction: column;
  scroll-snap-align: start;
  margin-right: ${props => props.theme.messenger.space.xs};

  ${props =>
    props.isLastSlide &&
    `
    margin-right: ${props => props.theme.messenger.space.md};
  `}
`

const BufferSlide = styled(Slide)`
  flex: 0 0 12.5%;
`

const AvatarSlide = styled(Slide)`
  padding-left: ${props => props.theme.messenger.space.sixteen}
  max-width: none;
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  margin-right: 0;
`

const Content = styled.div`
  flex: 1 0 auto;
  padding: ${props => props.theme.messenger.space.sixteen};
  border-radius: ${props =>
    `${props.theme.messenger.borderRadii.textMessage} ${props.theme.messenger.borderRadii.textMessage} 0 0`};
  border: ${props => `${props.theme.borders.sm} ${props.theme.palette.grey[300]}`};
`

const Title = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.md};
  line-height: ${props => props.theme.messenger.lineHeights.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
`

const Description = styled.div`
  font-size: ${props => props.theme.messenger.fontSizes.md};
  line-height: ${props => props.theme.messenger.lineHeights.md};
  font-weight: normal;
`

const Actions = styled.div``

const Action = styled.a`
  flex: 0 0 auto;
  display: block;
  padding: ${props => props.theme.messenger.space.sm} 0;
  font-size: ${props => props.theme.messenger.fontSizes.md};
  text-align: center;
  border-radius: 0;

  border: ${props => `${props.theme.borders.sm} ${props.theme.palette.grey[300]}`};
  border-top: 0;

  border-radius: ${props =>
    props.isLastAction &&
    `
    0 0 ${props.theme.messenger.borderRadii.textMessage} ${props.theme.messenger.borderRadii.textMessage}
  `};

  &,
  &:hover,
  &:focus {
    text-decoration: none;
    color: ${props => props.theme.messenger.colors.action};
  }

  &:hover {
    background-color: ${props => rgba(props.theme.messenger.colors.action, 0.08)};
  }

  &:focus {
    box-shadow: inset
      ${props => props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
  }
`

const ControlButton = styled(IconButton)`
  &&& {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: ${props => props.theme.messenger.space.xl};
    width: ${props => props.theme.messenger.space.xl};
    background-color: ${props => props.theme.palette.white};
    z-index: 1;
    box-shadow: 0px 1px 4px 0px rgba(71, 69, 123, 0.04), 0px 4px 12px 0px rgba(36, 36, 36, 0.1);

    svg {
      height: ${props => props.theme.messenger.iconSizes.md};
      width: ${props => props.theme.messenger.iconSizes.md};
    }

    border: 3px solid transparent;

    &[data-garden-focus-visible] {
      border: 3px solid ${props => rgba(props.theme.messenger.colors.action, 0.35)};
    }
  }
`

const NextButton = styled(ControlButton)`
  &&& {
    right: ${props => props.theme.messenger.space.sixteen};
    transform: translateY(-50%) scaleX(-1);
  }
`

const PreviousButton = styled(ControlButton)`
  &&& {
    left: ${props => props.theme.messenger.space.sixteen};
  }
`

const Heading = styled.div`
  margin-left: ${props =>
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
  Heading
}
