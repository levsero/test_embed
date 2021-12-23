import { Field } from 'react-final-form'
import styled from 'styled-components'

const StyledField = styled(Field)`
  margin-bottom: ${(props) => 16 / props.theme.fontSize}rem;
`

export { StyledField as Field }
