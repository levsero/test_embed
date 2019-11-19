import styled from 'styled-components'

import { FONT_SIZE } from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'

const HeaderView = styled.div`
  border-radius: ${isMobileBrowser() ? 'none' : `${8 / FONT_SIZE}rem ${8 / FONT_SIZE}rem 0 0`};
  padding: ${8 / FONT_SIZE}rem ${14 / FONT_SIZE}rem;
  background: ${props => props.theme.headerColorStr} !important;
  color: ${props => props.theme.headerTextColorStr} !important;
`

export default HeaderView
