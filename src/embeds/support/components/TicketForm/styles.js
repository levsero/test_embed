import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'
import { Main } from 'src/components/Widget'

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-block-end: 0;
  overflow-y: hidden;
`

const StyledMain = styled(Main)`
  margin-bottom: ${15 / FONT_SIZE}rem;
`

const Fields = styled.div`
  > *:not(:first-child) {
    margin-top: ${16 / FONT_SIZE}rem;
  }
`

const FieldWrapper = styled.div``

const TicketFormTitle = styled.div`
  margin-bottom: ${10 / FONT_SIZE}rem !important;
`

export { FormContainer, StyledMain as Main, Fields, FieldWrapper, TicketFormTitle }
