import { rem } from 'polished'
import styled, { css } from 'styled-components'
import InfoStrokeIcon from '@zendeskgarden/svg-icons/src/16/info-stroke.svg'

const animatedDuration = 0.4
const gardenNotificationBezierCurve = 'cubic-bezier(0.15, 0.85, 0.35, 1.2)'

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity ${animatedDuration}s ease-in,
    transform ${animatedDuration}s ${gardenNotificationBezierCurve};

  bottom: ${(props) => rem(40, props.theme.messenger.baseFontSize)};

  ${(props) =>
    props.theme.messenger.isFullScreen &&
    css`
      top: ${(props) => rem(60, props.theme.messenger.baseFontSize)};
      bottom: auto;

      @media (orientation: landscape) {
        top: ${(props) => rem(20, props.theme.messenger.baseFontSize)};
      }
    `}

  ${(props) => {
    if (props.state === 'entered') {
      return css`
        opacity: 1;
        transform: translateY(0);
      `
    }

    return css`
      opacity: 0;
      transform: translateY(40px);
    `
  }}
`

const Content = styled.div`
  font-family: ${(props) => props.theme.messenger.fontFamily};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 10;
  background: ${(props) => props.theme.messenger.colors.frameBackground};
  padding: ${(props) => props.theme.messenger.space.xs};
  border-radius: ${(props) => props.theme.messenger.borderRadii.textMessage};
  box-shadow: 0px 1px 4px 0px rgba(71, 69, 123, 0.04), 0px 4px 12px 0px rgba(36, 36, 36, 0.1);
`

const StyledIcon = styled(InfoStrokeIcon)`
  margin: 0 ${(props) => props.theme.messenger.space.xs};
`

const Label = styled.label`
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  margin-right: ${(props) => props.theme.messenger.space.sm};
`

export { Container, Content, StyledIcon as Icon, Label, animatedDuration }
