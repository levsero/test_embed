import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import {
  zdColorGrey100,
  zdColorGrey200,
  zdColorGrey800,
  zdColorWhite,
} from '@zendeskgarden/css-variables'
import { Button } from '@zendeskgarden/react-buttons'

const StyledButton = styled(Button)`
  &&& {
    /* a concession to SCSS and styled until Garden updates */
    background-color: ${zdColorWhite};
    border-color: ${zdColorGrey200} !important;
    color: ${zdColorGrey800} !important;
    box-shadow: 0 ${1 / FONT_SIZE}rem ${10 / FONT_SIZE}rem 0 rgba(0, 0, 0, 0.2);
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    z-index: 2;
    bottom: 50%;
    font-size: ${15 / FONT_SIZE}rem;
    padding: 0 ${20 / FONT_SIZE}rem !important;

    &:hover,
    &:focus,
    &:active {
      background: ${zdColorGrey100} !important;
    }

    ${(props) =>
      props.isMobile &&
      `
        bottom: ${60 / FONT_SIZE}rem;
        box-sizing: border-box !important;
        display: block !important;
      `}

    ${(props) =>
      props.theme.rtl &&
      `
        padding-left: ${9 / FONT_SIZE}rem !important;
        padding-right: ${14 / FONT_SIZE}rem !important;
        white-space: nowrap !important;
      `}
  }
`

export { StyledButton as Button }
