import styled from 'styled-components'
import { zdColorGrey200 } from '@zendeskgarden/css-variables'
import { Button } from '@zendeskgarden/react-buttons'
import { Form } from 'src/component/form/Form'
import { FONT_SIZE } from 'src/constants/shared'

const SubmitButton = styled(Button).attrs({
  isPrimary: true,
  type: 'submit',
})`
  max-width: ${200 / FONT_SIZE}rem !important;
  padding-right: ${10 / FONT_SIZE}rem !important;
  padding-left: ${10 / FONT_SIZE}rem !important;
`

const StyledForm = styled(Form)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  margin: 0;
`

const Header = styled.p`
  margin-bottom: ${15 / FONT_SIZE}rem !important;
`

const FormDivider = styled.div`
  margin-bottom: ${20 / FONT_SIZE}rem !important;
  width: 100% !important;
  border: ${0.5 / FONT_SIZE}rem solid ${zdColorGrey200};
`

export { SubmitButton, StyledForm as Form, Header, FormDivider }
