import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'

export const StyledList = styled.ol`
  padding: ${8 / FONT_SIZE}rem 0 0 ${16 / FONT_SIZE}rem;
  font-size: ${19 / FONT_SIZE}rem;

  [dir='rtl'] & {
    padding-right: ${24 / FONT_SIZE}rem;
    padding-left: 0;
  }
  ${({ isBottom }) => isBottom && `padding-bottom: ${20 / FONT_SIZE}rem;`}
  ${isMobileBrowser() &&
  `
    margin-bottom: ${20 / FONT_SIZE}rem !important;
    padding: ${8 / FONT_SIZE}rem 0 0 ${24 / FONT_SIZE}rem;
`}
`
