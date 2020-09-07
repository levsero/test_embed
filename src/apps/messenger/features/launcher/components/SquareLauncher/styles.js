import styled from 'styled-components'
import MessengerIcon from 'src/apps/messenger/icons/messenger_open.svg'
import CloseIcon from 'src/apps/messenger/icons/close-icon.svg'
import { IconButton } from '@zendeskgarden/react-buttons'

const Container = styled.div`
  margin: 5px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 64px;
  height: 64px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.messenger.colors.primary} !important;
`

const StyledMessengerIcon = styled(MessengerIcon)``

const StyledCloseIcon = styled(CloseIcon)``

const Button = styled(IconButton)`
  ${StyledCloseIcon} {
    height: 100% !important;
    width: 100% !important;
    g {
      fill: ${props => props.theme.messenger.colors.primaryText};
    }
  }
  ${StyledMessengerIcon} {
    width: 60% !important;
    height: 60% !important;
    path {
      fill: ${props => props.theme.messenger.colors.primaryText};
    }
  }
  :hover,
  :active {
    background-color: ${props => props.theme.messenger.colors.primary} !important;
    color: ${props => props.theme.messenger.colors.primary} !important;
    box-shadow: -4px 0px 20px 0px rgba(36, 36, 36, 0.2);
  }

  width: 100% !important;
  height: 100% !important;
`

export { Container, StyledMessengerIcon as MessengerIcon, StyledCloseIcon as CloseIcon, Button }
