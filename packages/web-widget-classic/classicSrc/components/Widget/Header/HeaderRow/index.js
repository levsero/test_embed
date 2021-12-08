import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'

const HeaderRow = styled.div`
  :not(:first-child) {
    margin-top: ${4 / FONT_SIZE}rem;
  }
`

export default HeaderRow
