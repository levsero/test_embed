import styled from 'styled-components'
import { Anchor } from '@zendeskgarden/react-buttons'
import AlertSVG from '@zendeskgarden/svg-icons/src/12/alert-error-stroke.svg'

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
`

const Tail = styled.div`
  border-top: ${props => props.theme.messenger.space.sm} solid
    ${props => props.theme.messenger.colors.message};
  border-left: ${props => props.theme.messenger.space.sm} solid transparent;

  ${props =>
    props.status === 'sending' &&
    `
    opacity: 0.5;
  `}
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

export { Layout, Tail, Time, FailedMessage, AlertIcon }
