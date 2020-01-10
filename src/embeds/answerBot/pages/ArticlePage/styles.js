import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import { SlideAppear } from 'component/transition/SlideAppear'

const FeedbackContainer = styled(SlideAppear)`
  width: 100%;
  position: absolute;
  overflow: hidden;
  border-radius: 0 0 ${8 / FONT_SIZE}rem ${8 / FONT_SIZE}rem;
`

export { FeedbackContainer }
