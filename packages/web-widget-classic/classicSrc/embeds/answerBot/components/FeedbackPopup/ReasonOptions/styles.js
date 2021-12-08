import { FONT_SIZE } from 'classicSrc/constants/shared'
import PillButton from 'classicSrc/embeds/answerBot/components/PillButton'
import styled from 'styled-components'

const ReasonButtons = styled.div`
  margin: 0 auto;
  width: 85%;
`

const RelatedButton = styled(PillButton)`
  margin-bottom: ${10 / FONT_SIZE}rem !important;
  width: 100%;
`

const UnrelatedButton = styled(PillButton)`
  width: 100%;
`

export { ReasonButtons, RelatedButton, UnrelatedButton }
