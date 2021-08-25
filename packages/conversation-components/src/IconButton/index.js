import { rgba } from 'polished'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import getReadableMessengerColor from 'src/ThemeProvider/getReadableMessengerColor'

const getAccessibleColors = (backgroundColor) => {
  return css`
    background-color: ${backgroundColor};
    color: ${getReadableMessengerColor(backgroundColor)};
  `
}

const StyledIconButton = styled(IconButton)`
  svg {
    width: ${(props) => props.theme.messenger.iconSizes[props.iconSize]};
    height: ${(props) => props.theme.messenger.iconSizes[props.iconSize]};
  }

  &&& {
    width: ${(props) => props.theme.messenger.space[props.buttonSize]};
    height: ${(props) => props.theme.messenger.space[props.buttonSize]};
    ${(props) => getAccessibleColors(props.theme.messenger.colors[props.backgroundColor])}
    align-self: center;

    &:hover {
      ${(props) =>
        getAccessibleColors(rgba(props.theme.messenger.colors[props.highlightColor], 0.2))}
    }

    &:active,
    &[aria-pressed='true'],
    &[aria-pressed='mixed'] {
      ${(props) =>
        getAccessibleColors(rgba(props.theme.messenger.colors[props.highlightColor], 0.35))}
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

StyledIconButton.defaultProps = {
  backgroundColor: 'primaryBackground',
  highlightColor: 'action',
}

StyledIconButton.propTypes = {
  iconSize: PropTypes.oneOf(['lg', 'md', 'sm', 'xl']),
  buttonSize: PropTypes.oneOf(['lg', 'md', 'sm', 'xl']),
  iconColor: PropTypes.oneOf(['actionText']),
  backgroundColor: PropTypes.string, // TODO:
}

export default StyledIconButton
