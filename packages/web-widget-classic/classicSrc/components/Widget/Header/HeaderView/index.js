import styled from 'styled-components'
import { FONT_SIZE } from 'classicSrc/constants/shared'

const HeaderView = styled.header`
  padding: ${8 / FONT_SIZE}rem ${14 / FONT_SIZE}rem;
  background: ${(props) => props.theme.headerColorStr} !important;
  color: ${(props) => props.theme.headerTextColorStr} !important;
`

export default HeaderView
