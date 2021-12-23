import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'

export const StyledLabel = (label) => styled(label)`
  line-height: 1.42857 !important;
  display: block;
  margin-bottom: ${6 / FONT_SIZE}rem;
  word-break: break-word;
`
