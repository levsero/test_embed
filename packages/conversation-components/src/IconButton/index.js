import { rgba } from 'polished'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import { defaultTheme } from 'src/ThemeProvider'
import getReadableMessengerColor from 'src/ThemeProvider/getReadableMessengerColor'

const StyledIconButton = styled(IconButton)`
  svg {
    width: ${(props) => props.theme.messenger.iconSizes[props.iconSize]};
    height: ${(props) => props.theme.messenger.iconSizes[props.iconSize]};
  }

  &&& {
    width: ${(props) => props.theme.messenger.space[props.buttonSize]};
    height: ${(props) => props.theme.messenger.space[props.buttonSize]};
    background-color: ${(props) => props.theme.messenger.colors[props.backgroundColor]};
    color: ${(props) =>
      props.backgroundColor === 'primaryBackground'
        ? getReadableMessengerColor(
            props.theme.messenger.colors[props.backgroundColor],
            props.theme.palette.grey[500]
          )
        : getReadableMessengerColor(
            props.theme.messenger.colors[props.backgroundColor],
            props.theme.palette.grey[800],
            props.theme.palette.white
          )};
    align-self: center;

    &:hover {
      background-color: ${(props) =>
        rgba(props.theme.messenger.colors[props.highlightColor], 0.08)};
      color: ${(props) =>
        props.backgroundColor === 'primaryBackground'
          ? getReadableMessengerColor(
              props.theme.messenger.colors[props.backgroundColor],
              props.theme.palette.grey[600]
            )
          : getReadableMessengerColor(
              props.theme.messenger.colors[props.backgroundColor],
              props.theme.palette.black,
              props.theme.palette.white
            )};
    }
    &:active,
    &[aria-pressed='true'],
    &[aria-pressed='mixed'] {
      background-color: ${(props) => rgba(props.theme.messenger.colors[props.highlightColor], 0.2)};
    }

    &[data-garden-focus-visible] {
      box-shadow: ${(props) =>
        props.theme.shadows.md(rgba(props.theme.messenger.colors[props.highlightColor], 0.2))};
      color: ${(props) =>
        props.backgroundColor === 'primaryBackground'
          ? getReadableMessengerColor(
              props.theme.messenger.colors[props.backgroundColor],
              props.theme.palette.grey[500]
            )
          : getReadableMessengerColor(
              props.theme.messenger.colors[props.backgroundColor],
              props.theme.palette.grey[800],
              props.theme.palette.white
            )};
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
  iconSize: PropTypes.oneOf(Object.keys(defaultTheme.messenger.iconSizes)),
  buttonSize: PropTypes.oneOf(Object.keys(defaultTheme.messenger.space)),
  highlightColor: PropTypes.oneOf(Object.keys(defaultTheme.messenger.colors)),
  backgroundColor: PropTypes.oneOf(Object.keys(defaultTheme.messenger.colors)),
}

export default StyledIconButton
