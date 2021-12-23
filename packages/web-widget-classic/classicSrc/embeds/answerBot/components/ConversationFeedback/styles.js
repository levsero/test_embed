import { FONT_SIZE } from 'classicSrc/constants/shared'
import PillButton from 'classicSrc/embeds/answerBot/components/PillButton'
import styled from 'styled-components'

const Container = styled.div`
  margin-bottom: ${7 / FONT_SIZE}rem;
`

const Option = styled(PillButton)`
  float: right !important;
  display: block;
  margin-bottom: ${7 / FONT_SIZE}rem !important;
`

export { Container, Option }
