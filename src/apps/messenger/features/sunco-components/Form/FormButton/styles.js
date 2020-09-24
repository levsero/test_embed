import styled from 'styled-components'
import { Dots } from '@zendeskgarden/react-loaders'
import { Button } from '@zendeskgarden/react-buttons'
import { rgba, rem } from 'polished'

import { baseFontSize } from 'src/apps/messenger/features/themeProvider'

const Label = styled.div`
  opacity: ${props => (props.showLabel ? 1 : 0)};
`

const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoadingDots = styled(Dots)``

const StyledButton = styled(Button)`
  &&& {
    position: relative;
    border-color: ${props => props.theme.messenger.colors.action};
    background-color: ${props => props.theme.messenger.colors.action};
    color: ${props => props.theme.messenger.colors.actionText};
    height: ${rem('40px', baseFontSize)};
    line-height: ${rem('38px', baseFontSize)};
    border-radius: ${props => props.theme.messenger.borderRadii.textMessage};
    font-size: ${props => props.theme.messenger.fontSizes.md};

    :hover {
      border: ${props => props.theme.borders.sm} ${props => props.theme.messenger.colors.action};
      box-shadow: ${props =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
    }

    :active,
    [aria-pressed='true'],
    [aria-pressed='mixed'] {
      background-color: ${props => rgba(props.theme.messenger.colors.action, 0.85)};
    }

    &[data-garden-focus-visible] {
      box-shadow: ${props =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
    }
  }
`

export { LoadingDots, Label, StyledButton as Button, Loader }
