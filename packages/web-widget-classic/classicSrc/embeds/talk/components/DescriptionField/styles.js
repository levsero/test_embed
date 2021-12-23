import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { Textarea } from '@zendeskgarden/react-forms'

const StyledTextarea = styled(Textarea)`
  margin-bottom: ${20 / FONT_SIZE}rem;
`

export { StyledTextarea as Textarea }
