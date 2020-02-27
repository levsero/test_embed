import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import { SlideAppear } from 'component/transition/SlideAppear'

const FeedbackContainer = styled(SlideAppear)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -${1 / FONT_SIZE}rem ${12 / FONT_SIZE}rem rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
`

export { FeedbackContainer }
