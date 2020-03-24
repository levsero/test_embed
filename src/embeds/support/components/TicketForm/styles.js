import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-block-end: 0;
  overflow-y: hidden;
`

const Fields = styled.div`
  > *:not(:first-child) {
    margin-top: ${16 / FONT_SIZE}rem;
  }
`

const TicketFormTitle = styled.div`
  margin-bottom: ${10 / FONT_SIZE}rem !important;
`

export { FormContainer, Fields, TicketFormTitle }
