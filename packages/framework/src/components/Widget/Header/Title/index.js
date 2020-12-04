import styled from 'styled-components'
import { FONT_SIZE, TEST_IDS } from 'constants/shared'

const Title = styled.h1.attrs(() => ({
  'data-testid': TEST_IDS.WIDGET_TITLE
}))`
  font-weight: 700;
  text-align: center;
  letter-spacing: ${0.3 / FONT_SIZE}rem;
  line-height: 1.5;
  font-size: ${15 / FONT_SIZE}rem;
  flex-grow: 1;
  margin-bottom: 2px;
`

export default Title
