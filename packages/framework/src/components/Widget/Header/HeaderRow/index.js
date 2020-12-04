import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'

const HeaderRow = styled.div`
  :not(:first-child) {
    margin-top: ${4 / FONT_SIZE}rem;
  }
`

export default HeaderRow
