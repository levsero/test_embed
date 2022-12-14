import styled from 'styled-components'
import disabledAnimationsCSS from 'src/animations/disabledAnimationsCSS'
import messageSteps, { transition } from 'src/animations/messageSteps'
import { MESSAGE_STATUS } from 'src/constants'
import dirStyles from 'src/utils/dirStyles'

const enter = `
  .receipt-appear-active &,
  .receipt-appear-done &,
  .receipt-enter-done &
`

const exit = `
  .receipt-exit &,
  .receipt-exit-done &
`

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${(props) => props.theme.messenger.space.xxxs};
  margin-${dirStyles.left}: calc(
    ${(props) => props.theme.messenger.iconSizes.xl} + ${(props) => props.theme.messenger.space.md}
  );
  justify-content: flex-start;
`

const Time = styled.p`
  color: ${(props) => props.theme.palette.grey[600]};
  font-size: ${(props) => props.theme.messenger.fontSizes.sm};
  line-height: ${(props) => props.theme.messenger.lineHeights.sm};

  margin: 0;
  margin-${dirStyles.left}: ${(props) => props.theme.messenger.space.xs};

  opacity: 0;

  ${(props) =>
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

  ${disabledAnimationsCSS}
`

const Tail = styled.div`
  border-top: ${(props) => props.theme.messenger.space.sm} solid
    ${(props) => props.theme.messenger.colors.otherParticipantMessage};
  border-${dirStyles.right}: ${(props) => props.theme.messenger.space.sm} solid transparent;

  transform: translateY(-105%) scale(0);
  opacity: 0;

  ${(props) =>
    !props.isFreshMessage &&
    `
    transform: translateY(0) scale(1);
    opacity: 1;
  `}

  ${enter} {
    transition: ${transition(messageSteps.tailEnter, 'transform', 'opacity')};

    transform: translateY(0) scale(1);
    opacity: 1;

    ${(props) =>
      props.status === MESSAGE_STATUS.sending &&
      `
      opacity: ${props.theme.messenger.opacity.sendingMessageStatus};
  `}
  }

  ${exit} {
    transition: ${transition(messageSteps.tailExit, 'transform')};

    transform: translateY(-105%) scale(0);
    opacity: 1;
    ${(props) =>
      props.status === MESSAGE_STATUS.sending &&
      `
      opacity: ${props.theme.messenger.opacity.sendingMessageStatus};
  `}

  ${disabledAnimationsCSS}
`

export { Layout, Tail, Time }
