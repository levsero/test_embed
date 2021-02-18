import styled from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import { rgba } from 'polished'

const Container = styled.div`
  width: ${(props) => props.size ?? '100%'};
  height: ${(props) => props.size ?? '100%'};
  box-shadow: rgba(36, 36, 36, 0.1) 0px 8px 16px 0px, rgba(36, 36, 36, 0.04) 0px 1px 4px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.messenger.colors.primary} !important;
`

const Button = styled(IconButton)`
  &&& {
    position: relative;
    overflow: hidden;
    border-radius: 0;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.messenger.colors.primary};

    &:active {
      box-shadow: none;
    }

    &[data-garden-focus-visible],
    &:focus {
      box-shadow: inset
        ${(props) => props.theme.shadows.md(rgba(props.theme.messenger.colors.primaryText, 0.35))};
    }

    @supports selector(:focus-visible) {
      &:focus {
        box-shadow: none;
      }

      &[data-garden-focus-visible],
      &:focus-visible {
        box-shadow: inset
          ${(props) => props.theme.shadows.md(rgba(props.theme.messenger.colors.primaryText, 0.35))};
      }
    }
  }
`

export { Container, Button }
