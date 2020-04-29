import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-block-end: 0;
  overflow-y: hidden;

  > *:first-child {
    padding-bottom: ${props => 10 / props.theme.fontSize}rem;
  }
`

const Fields = styled.div`
  > *:not(:first-child) {
    margin-top: ${16 / FONT_SIZE}rem;
  }
`

export { FormContainer, Fields }
