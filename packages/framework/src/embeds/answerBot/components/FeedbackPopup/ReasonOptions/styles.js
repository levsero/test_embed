import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import PillButton from 'src/embeds/answerBot/components/PillButton'

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
