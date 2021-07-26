import styled from 'styled-components'
import { Input } from '@zendeskgarden/react-forms'
import { FONT_SIZE } from 'src/constants/shared'

const StyledInput = styled(Input)`
  margin-bottom: ${20 / FONT_SIZE}rem;
`

export { StyledInput as Input }
