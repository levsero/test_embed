import styled from 'styled-components'
import { FauxInput, Input } from '@zendeskgarden/react-textfields'
import { FONT_SIZE } from 'constants/shared'

const StyledFauxInput = styled(FauxInput)`
  padding: 0 !important;
`

const StyledInput = styled(Input)`
  padding: ${10 / FONT_SIZE}rem !important;
  align-self: center !important;
`

const StyledContainer = styled.div`
  margin-bottom: ${16 / FONT_SIZE}rem !important;
`

export { StyledFauxInput as FauxInput, StyledInput as Input, StyledContainer as Container }
