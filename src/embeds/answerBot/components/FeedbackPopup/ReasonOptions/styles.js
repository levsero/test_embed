import styled from 'styled-components'
import { PillButton } from 'src/embeds/answerBot/components/PillButton'
import { FONT_SIZE } from 'src/constants/shared'

const ReasonButtons = styled.div`
  margin: 0 auto;
  width: 85%;
`

const RelatedButton = styled(PillButton)`
  margin-bottom: ${10 / FONT_SIZE}rem;
  width: 100%;
`

const UnrelatedButton = styled(PillButton)`
  width: 100%;
`

export { ReasonButtons, RelatedButton, UnrelatedButton }
