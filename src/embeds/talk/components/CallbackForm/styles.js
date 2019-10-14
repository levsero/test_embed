import styled from 'styled-components'
import PropTypes from 'prop-types'

import { zdColorGrey200 } from '@zendeskgarden/css-variables'
import { Button } from '@zendeskgarden/react-buttons'
import { Form } from 'component/form/Form'
import { FONT_SIZE } from 'constants/shared'

const SubmitButton = styled(Button).attrs({
  primary: true,
  type: 'submit'
})`
  max-width: ${200 / FONT_SIZE}rem !important;
  padding-right: ${10 / FONT_SIZE}rem !important;
  padding-left: ${10 / FONT_SIZE}rem !important;
`

const FooterView = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${props => (props.hideZendeskLogo ? 'flex-end' : 'space-between')};
  margin-top: ${15 / FONT_SIZE}rem;
`
FooterView.propTypes = {
  hideZendeskLogo: PropTypes.bool
}

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

export { SubmitButton, FooterView, StyledForm as Form, Header, FormDivider }
