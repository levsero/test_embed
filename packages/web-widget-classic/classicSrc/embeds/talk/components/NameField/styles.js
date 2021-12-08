import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { Input } from '@zendeskgarden/react-forms'

const StyledInput = styled(Input)`
  margin-bottom: ${20 / FONT_SIZE}rem;
`

export { StyledInput as Input }
