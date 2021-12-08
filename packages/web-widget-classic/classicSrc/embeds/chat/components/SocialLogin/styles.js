import { FONT_SIZE } from 'classicSrc/constants/shared'
import FacebookIcon from 'classicSrc/embeds/chat/icons/widget-icon_facebook.svg'
import GoogleIcon from 'classicSrc/embeds/chat/icons/widget-icon_google.svg'
import styled from 'styled-components'
import { zdColorGrey100, zdColorGrey400, zdColorWhite } from '@zendeskgarden/css-variables'
import { IconButton } from '@zendeskgarden/react-buttons'

const SocialLoginContainer = styled.div`
  &&& {
    margin-bottom: ${14 / FONT_SIZE}rem;
    display: flex;
    align-items: center;
  }
  ${(props) =>
    props.shouldSpace &&
    `
  margin-top: ${15 / props.theme.fontSize}rem`}
`

const LoginIconButton = styled(IconButton)`
  &&& {
    border: ${1 / FONT_SIZE}rem solid ${zdColorGrey400} !important;
    width: ${44 / FONT_SIZE}rem !important;
    height: ${28 / FONT_SIZE}rem !important;
    border-radius: ${14 / FONT_SIZE}rem;
    position: relative;
    top: ${3 / FONT_SIZE}rem;
    margin-left: ${5 / FONT_SIZE}rem;
    display: inline-block;

    ${(props) =>
      props.theme.rtl &&
      `
      margin-right: ${5 / FONT_SIZE}rem;
    `}

    :focus {
      box-shadow: 0 0 0 ${3 / FONT_SIZE}rem ${(props) => props.theme.headerFocusRingColorStr} !important;
      background-color: ${zdColorWhite} !important;
    }

    :hover {
      background-color: ${zdColorGrey100} !important;
    }
  }
`
const FacebookLoginIcon = styled(FacebookIcon)`
   {
    && {
      width: ${15 / FONT_SIZE}rem;
      height: ${15 / FONT_SIZE}rem;
    }
    path {
      fill: #3b5998;
    }
  }
`

const GoogleLoginIcon = styled(GoogleIcon)`
   {
    && {
      width: ${15 / FONT_SIZE}rem;
      height: ${15 / FONT_SIZE}rem;
    }
  }
`
export { SocialLoginContainer, LoginIconButton, FacebookLoginIcon, GoogleLoginIcon }
