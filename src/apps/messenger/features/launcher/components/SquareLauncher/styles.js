import styled from 'styled-components'
import MessengerIcon from 'src/apps/messenger/icons/messenger_open.svg'
import CloseIcon from 'src/apps/messenger/icons/close-icon.svg'
import { IconButton } from '@zendeskgarden/react-buttons'
import { rgba } from 'polished'

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.messenger.colors.primary} !important;
`

const StyledMessengerIcon = styled(MessengerIcon)``

const StyledCloseIcon = styled(CloseIcon)``

const Button = styled(IconButton)`
  position: relative;
  overflow: hidden;

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

  &&& {
    border-radius: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.messenger.colors.primary};

    &:active {
      box-shadow: none;
    }

    &[data-garden-focus-visible],
    &:focus {
      box-shadow: inset
        ${props => props.theme.shadows.md(rgba(props.theme.messenger.colors.primaryText, 0.35))};
    }

    @supports selector(: focus-visible) {
      &:focus {
        box-shadow: none;
      }

      &[data-garden-focus-visible],
      &:focus-visible {
        box-shadow: inset
          ${props => props.theme.shadows.md(rgba(props.theme.messenger.colors.primaryText, 0.35))};
      }
    }
  }
`

export { Container, StyledMessengerIcon as MessengerIcon, StyledCloseIcon as CloseIcon, Button }
