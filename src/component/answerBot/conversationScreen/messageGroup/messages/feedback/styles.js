import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import { PillButton } from 'src/embeds/answerBot/components/PillButton'

const Container = styled.div`
  margin-bottom: ${7 / FONT_SIZE}rem;
`

const Option = styled(PillButton)`
  float: right !important;
  display: block;
  margin-bottom: ${7 / FONT_SIZE}rem !important;
`

export { Container, Option }
