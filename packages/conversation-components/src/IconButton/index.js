import { rgba } from 'polished'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import { FONT_SIZE } from 'src/constants/shared'

const HEADER_ICON_SIZE = 2

const StyledIconButton = styled(IconButton)`
  svg {
    width: ${(props) => props.theme.messenger.iconSizes[props.iconSize]};
    height: ${(props) => props.theme.messenger.iconSizes[props.iconSize]};
  }

  &&& {
    width: ${(props) => props.theme.messenger.space[props.size]};
    height: ${(props) => props.theme.messenger.space[props.size]};
    color: ${(props) => props.theme.messenger.colors[props.iconColor]};
    align-self: center;

    &:hover {
      background-color: ${(props) => rgba(props.theme.messenger.colors[props.highlightColor], 0.2)};
    }

    &:active,
    &[aria-pressed='true'],
    &[aria-pressed='mixed'] {
      background-color: ${(props) =>
        rgba(props.theme.messenger.colors[props.highlightColor], 0.35)};
    }

    &[data-garden-focus-visible] {
      box-shadow: ${(props) =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors[props.highlightColor], 0.2))};
    }

    /* We have to style this as a child of the button in order to access the theme props */
    svg {
      width: ${(props) => props.theme.messenger.iconSizes[props.iconSize]};
      height: ${(props) => props.theme.messenger.iconSizes[props.iconSize]};
    }
  }
`

StyledIconButton.propTypes = {
  iconSize: PropTypes.oneOf(['lg', 'md', 'sm', 'xl']),
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'xl']),
  iconColor: PropTypes.oneOf(['actionText']),
}

export { StyledIconButton as IconButton }
