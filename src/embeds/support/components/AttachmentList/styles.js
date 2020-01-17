import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'
import { Field, Label } from '@zendeskgarden/react-forms'

export const Container = styled(Field)`
  display: block !important;
  margin-bottom: ${10 / FONT_SIZE}rem !important;

  &:last-of-type {
    margin-bottom: 0;
  }
`

export const StyledLabel = styled(Label)`
  font-weight: bold !important;
`
