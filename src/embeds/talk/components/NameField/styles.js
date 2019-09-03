import styled from 'styled-components'
import { TextField } from '@zendeskgarden/react-textfields'
import { FONT_SIZE } from 'constants/shared'

const StyledTextField = styled(TextField)`
  margin-bottom: ${20 / FONT_SIZE}rem;
`

export { StyledTextField as TextField }
