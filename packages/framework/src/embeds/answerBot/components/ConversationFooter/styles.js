import styled from 'styled-components'
import { zdColorWhite } from '@zendeskgarden/css-variables'
import { SlideAppear } from 'src/component/transition/SlideAppear'
import { FooterView } from 'src/components/Widget'
import { isMobileBrowser } from 'utility/devices'

const Footer = styled(FooterView)`
  ${(props) => {
    return `
      box-shadow: 0 0 ${12 / props.theme.fontSize}rem ${
      8 / props.theme.fontSize
    }rem ${zdColorWhite};
      z-index: 1;
    `
  }}
`

const LogoContainer = styled.div`
  ${(props) => {
    if (isMobileBrowser()) {
      return `margin: ${8 / props.theme.fontSize}rem ${20 / props.theme.fontSize}rem;`
    } else {
      return `margin-top: ${8 / props.theme.fontSize}rem;`
    }
  }}
`

const slideAppearMobile = (props) => {
  return `${props.theme.rtl ? 'left' : 'right'}: ${10 / props.theme.fontSize}rem;`
}

const Slide = styled(SlideAppear)`
  ${(props) => {
    return `
      position: relative;
      ${isMobileBrowser() ? slideAppearMobile(props) : ''}
    `
  }}
`

export { Footer, LogoContainer, Slide as SlideAppear }
