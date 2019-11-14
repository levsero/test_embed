import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'
import { Main } from 'src/components/Widget'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-block-end: 0;
`

const StyledMain = styled(Main)`
  margin-bottom: ${15 / FONT_SIZE}rem;
`

const FieldWrapper = styled.div`
  :not(:first-child) {
    margin-top: ${16 / FONT_SIZE}rem;
  }
`

export { Form, StyledMain as Main, FieldWrapper }
