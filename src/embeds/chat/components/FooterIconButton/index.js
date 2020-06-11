import styled from 'styled-components'
import PropTypes from 'prop-types'
import { IconButton } from '@zendeskgarden/react-buttons'
import { FONT_SIZE } from 'constants/shared'
import {
  zdColorGrey300,
  zdColorGrey400,
  zdColorGrey600,
  zdColorGrey800
} from '@zendeskgarden/css-variables'
import { isMobileBrowser } from 'utility/devices'

const size = () => `${(isMobileBrowser() ? 16 : 14) / FONT_SIZE}rem`
const padding = () => `${(isMobileBrowser() ? 8 : 5) / FONT_SIZE}rem`

const FooterIconButton = styled(IconButton)`
  width: auto !important;
  height: auto !important;

  ${() =>
    isMobileBrowser() &&
    `
  margin: 0 ${4 / FONT_SIZE}rem !important;
  `}

  svg {
    box-sizing: content-box;
    padding: ${padding};
    min-width: ${size};
    min-height: ${size};
    width: ${size} !important;
    height: ${size} !important;

    g,
    path {
      ${props => props.colorType}: ${zdColorGrey600} !important;
    }
  }

  &:not(:disabled) {
    &:hover,
    &:active,
    &:focus {
      background: ${zdColorGrey300} !important;

      svg > g,
      path {
        ${props => props.colorType}: ${zdColorGrey800} !important;
      }
    }
  }

  &:disabled svg g {
    fill: ${zdColorGrey400} !important;
  }
`

FooterIconButton.propTypes = {
  colorType: PropTypes.oneOf(['fill', 'stroke'])
}

FooterIconButton.defaultProps = {
  isPill: isMobileBrowser(),
  ignoreThemeOverride: true,
  colorType: 'stroke',
  size: 'small'
}

export default FooterIconButton
