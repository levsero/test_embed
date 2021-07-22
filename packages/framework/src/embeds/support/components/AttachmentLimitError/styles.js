import styled from 'styled-components'
import { zdColorRed300, zdColorRed500 } from '@zendeskgarden/css-variables'
import { Alert, Title } from '@zendeskgarden/react-notifications'
import { FONT_SIZE } from 'src/constants/shared'

export const ErrorTitle = styled(Title)`
  font-size: ${14 / FONT_SIZE}rem;
  padding-left: ${(props) => (props.theme.rtl ? `${15 / FONT_SIZE}rem !important` : 0)};
  padding-right: ${(props) => (props.theme.rtl ? 0 : `${15 / FONT_SIZE}rem !important`)};
`

export const StyledAlert = styled(Alert)`
  padding: ${10 / FONT_SIZE}rem !important;
  border-radius: ${4 / FONT_SIZE}rem;
  background-color: rgba(${zdColorRed500}, 0.1);
  padding-left: ${(props) => (props.theme.rtl ? 0 : `${50 / FONT_SIZE}rem !important`)};
  padding-right: ${(props) => (props.theme.rtl ? `${50 / FONT_SIZE}rem !important` : 0)};
  border: ${1 / FONT_SIZE}rem solid ${zdColorRed300};
  color: ${zdColorRed500};
  line-height: ${20 / FONT_SIZE}rem;
  background-position-y: ${12 / FONT_SIZE}rem !important;
  margin-bottom: ${10 / FONT_SIZE}rem !important;
`
