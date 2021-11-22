import styled from 'styled-components'
import { zdColorGrey300 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'
import { isFirefox, isIE } from 'src/util/devices'

const firefox = isFirefox()
const ie = isIE()

const webkitStyles = `
  &::-webkit-scrollbar-track {
    margin: ${15 / FONT_SIZE} 0;
  }

  &::-webkit-scrollbar {
    box-shadow: none;
    width: ${6 / FONT_SIZE}rem;
  }

  &::-webkit-scrollbar-thumb {
    background: ${zdColorGrey300};
    border-radius: ${3 / FONT_SIZE}rem;
  }`

const firefoxStyles = `
  padding-left: ${20 / FONT_SIZE}rem;
  padding-right: ${20 / FONT_SIZE}rem;
  margin: 0;
  scrollbar-width: thin;
`

const Container = styled.main`
  flex-grow: 2;
  padding-top: ${15 / FONT_SIZE}rem;
  padding-left: ${10 / FONT_SIZE}rem;
  padding-right: ${15 / FONT_SIZE}rem;
  margin-left: ${10 / FONT_SIZE}rem;
  margin-right: ${5 / FONT_SIZE}rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;

  ${!(firefox || ie) && webkitStyles}

  ${firefox && firefoxStyles}
`

export { Container }
