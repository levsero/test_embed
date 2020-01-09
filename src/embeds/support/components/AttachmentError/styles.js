import styled from 'styled-components'
import { Alert, Title } from '@zendeskgarden/react-notifications'
import {
  zdColorRed300,
  zdColorRed500,
  zdColorGrey600,
  zdColorGrey800
} from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

export const ErrorTitle = styled(Title)`
  font-size: ${14 / FONT_SIZE}rem;
`

export const FileName = styled.div`
  font-size: ${14 / FONT_SIZE}rem;
  color: ${zdColorGrey800};
`
export const FileSize = styled.div`
  font-size: ${14 / FONT_SIZE}rem;
  color: ${zdColorGrey600};
`

export const StyledAlert = styled(Alert)`
  padding: ${10 / FONT_SIZE}rem !important;
  border-radius: ${4 / FONT_SIZE}rem;
  background-color: rgba(${zdColorRed500}, 0.1);
  padding-left: ${props => (props.theme.rtl ? 0 : `${50 / FONT_SIZE}rem !important`)};
  padding-right: ${props => (props.theme.rtl ? `${50 / FONT_SIZE}rem !important` : 0)};
  border: ${1 / FONT_SIZE}rem solid ${zdColorRed300};
  color: ${zdColorRed500};
  line-height: ${20 / FONT_SIZE}rem;
  background-position-y: ${12 / FONT_SIZE}rem !important;
  margin-bottom: ${10 / FONT_SIZE}rem !important;
`
