import styled from 'styled-components'
import { Textarea } from '@zendeskgarden/react-forms'
import { FONT_SIZE } from 'src/constants/shared'

const StyledTextarea = styled(Textarea)`
  margin-bottom: ${20 / FONT_SIZE}rem;
`

export { StyledTextarea as Textarea }
