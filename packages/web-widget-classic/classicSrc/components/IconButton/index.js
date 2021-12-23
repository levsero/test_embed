import { readableColor, rgba } from 'polished'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconButton as GardenIconButton } from '@zendeskgarden/react-buttons'

const IconButton = styled(GardenIconButton).attrs(() => ({
  ignoreThemeOverride: true,
}))`
  &&& {
    width: 2rem;
    height: 2rem !important;
    background-color: ${(props) => props.theme[props.backgroundColor]};
    /*
      IconButton needs to handle the icon color for white backgrounds (the assumed default
      which we control), and for light and dark backgrounds for components like the
      Header (configurable by users). This current implementation assumes a white background
      as the default so if more than one default needed to be supported (e.g. we introduce a
      dark mode), this would need to change.
    */
    color: ${(props) =>
      readableColor(
        props.theme[props.backgroundColor],
        props.theme.palette.grey[800],
        '#ffffff',
        false
      )};

    align-self: center;

    &:hover {
      background-color: ${(props) => rgba(props.theme[props.highlightColor], 0.08)};
      /*
        IconButton needs to handle the icon color for white backgrounds (the assumed default
        which we control), and for light and dark backgrounds for components like the
        Header (configurable by users). This current implementation assumes a white background
        as the default so if more than one default needed to be supported (e.g. we introduce a
        dark mode), this would need to change.
      */

      color: ${(props) =>
        readableColor(
          props.theme[props.backgroundColor],
          props.theme.palette.grey[800],
          '#ffffff',
          false
        )};
    }
    &:active,
    &[aria-pressed='true'],
    &[aria-pressed='mixed'] {
      background-color: ${(props) => rgba(props.theme[props.highlightColor], 0.2)};
    }

    &[data-garden-focus-visible] {
      box-shadow: ${(props) =>
        props.theme.shadows.md(rgba(props.theme[props.highlightColor], 0.2))};
    }

    /* We have to style this as a child of the button in order to access the theme props */
    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`

IconButton.defaultProps = {
  backgroundColor: 'frameBackgroundColor',
  highlightColor: 'baseHighlightColor',
}

IconButton.propTypes = {
  backgroundColor: PropTypes.string,
  highlightColor: PropTypes.string,
}

export default IconButton
