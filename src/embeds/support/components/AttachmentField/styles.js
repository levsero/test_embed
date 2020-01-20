import styled from 'styled-components'
import { Field, Label } from '@zendeskgarden/react-forms'

export const Container = styled(Field)`
  display: block !important;
  margin-bottom: ${props => 10 / props.theme.fontSize}rem !important;

  &:last-of-type {
    margin-bottom: 0;
  }
`

export const StyledLabel = styled(Label)`
  font-weight: bold !important;
`
