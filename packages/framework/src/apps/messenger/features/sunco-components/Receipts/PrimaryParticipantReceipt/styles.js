import styled, { css, keyframes } from 'styled-components'
import { Anchor } from '@zendeskgarden/react-buttons'
import AlertSVG from '@zendeskgarden/svg-icons/src/12/alert-error-stroke.svg'
import messageSteps, {
  transition
} from 'src/apps/messenger/features/sunco-components/Animated/messageSteps'
import { rem } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import { MESSAGE_STATUS } from 'src/apps/messenger/features/sunco-components/constants'

const enter = `
  .receipt-appear-active &,
  .receipt-appear-done &,
  .receipt-enter-done &
`

const exit = `
  .receipt-exit &,
  .receipt-exit-done &
`

const wasJustSent = styles => props => {
  if (props.previousStatus === MESSAGE_STATUS.sending && props.status === MESSAGE_STATUS.sent) {
    return styles
  }

  return ''
}

const sendingKeyframes = props => keyframes`
  0% {
    border-top: ${rem('6px', baseFontSize)} solid
      ${props.theme.messenger.colors.message};
    border-left: ${rem('6px', baseFontSize)} solid transparent;
  }
  100% {
    border-top: ${rem('8px', baseFontSize)} solid
      ${props.theme.messenger.colors.message};
    border-left: ${rem('8px', baseFontSize)} solid transparent;
  }
`

const sendingToSentKeyframes = props => keyframes`
  0% {
    border-top: ${rem('6px', baseFontSize)} solid
      ${props.theme.messenger.colors.message};
    border-left: ${rem('6px', baseFontSize)} solid transparent;
  }
  100% {
    border-top: ${props.theme.messenger.space.sm} solid
      ${props.theme.messenger.colors.message};
    border-left: ${props.theme.messenger.space.sm} solid transparent;
  }
`

const tailSendingDuration = 0.5
const tailSendingDelay = 0.3
const tailSendingToSentDuration = 0.3
const tailSendingToSentDelay = 0

const sendingAnimation = css`
  ${sendingKeyframes} ${tailSendingDuration}s linear ${tailSendingDelay}s infinite alternate backwards running
`
const sendingToSentAnimation = css`
  ${sendingToSentKeyframes} ${tailSendingToSentDuration}s linear ${tailSendingToSentDelay}s 1 alternate forwards running
`

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${props => props.theme.messenger.space.xxxs};
  margin-right: ${props => props.theme.messenger.space.sm};
  justify-content: flex-end;
`

const Time = styled.p`
  color: ${props => props.theme.palette.grey[600]};
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  margin-right: ${props => props.theme.messenger.space.xs};
  text-align: right;

  opacity: 0;

  ${props =>
    !props.isFreshMessage &&
    `
    opacity: 1;
  `}

  ${enter} {
    transition: ${transition(messageSteps.textEnter, 'opacity')};

    opacity: 1;
  }

  ${exit} {
    transition: ${transition(messageSteps.textExit, 'opacity')};

    opacity: 0;
  }
`
const TailContainer = styled.div`
  width: ${props => props.theme.messenger.space.sm};
  height: ${props => props.theme.messenger.space.sm};
  position: relative;
  overflow: visible;
`

const Tail = styled.div`
  position:absolute;
  top: 0;
  left: 0

  border-top: ${props => props.theme.messenger.space.sm} solid
    ${props => props.theme.messenger.colors.message};
  border-left: ${props => props.theme.messenger.space.sm} solid transparent;
  opacity: 1;

  transform: translateY(-105%) scale(0);

  ${props =>
    !props.isFreshMessage &&
    `
    transform: translateY(0) scale(1);
  `}

  ${enter} {
    transition: ${transition(messageSteps.tailEnter, 'transform')},
      ${transition(messageSteps.messageStatusOpacity, 'opacity')};

    transform: translateY(0) scale(1);
    opacity: 1;

    ${props =>
      props.status === 'sending' &&
      `
    opacity: 0.5;
  `}
  }

  ${exit} {
    transition: ${transition(messageSteps.tailExit, 'transform')},
      ${transition(messageSteps.messageStatusOpacity, 'opacity')};

    transform: translateY(-105%) scale(0);
    opacity: 1;
    ${props =>
      props.status === 'sending' &&
      `
    opacity: 0.5;
  `}
  }

  ${props =>
    props.status === 'sending' &&
    css`
      animation: ${sendingAnimation};
    `}

  ${wasJustSent(css`
    animation: ${sendingToSentAnimation};
  `)}
`

const FailedMessage = styled(Anchor)`
  &&& {
    border: 0;
    color: ${props => props.theme.palette.red[400]};
    font-size: ${props => props.theme.messenger.fontSizes.sm};
    background-color: transparent;

    &:focus {
      text-decoration: underline;
    }
  }
`

const AlertIcon = styled(AlertSVG)`
  height: ${props => props.theme.messenger.iconSizes.sm};
  width: ${props => props.theme.messenger.iconSizes.sm};
  max-height: none;
`

export { Layout, Tail, Time, FailedMessage, AlertIcon, TailContainer }
