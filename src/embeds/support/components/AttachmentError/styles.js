import styled from 'styled-components'
import { Alert, Title } from '@zendeskgarden/react-notifications'
import {
  zdColorGrey700,
  zdColorRed300,
  zdColorRed500,
  zdColorGrey600
} from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

export const ErrorTitle = styled(Title)`
  color: ${zdColorGrey700} !important;
  font-size: ${12 / FONT_SIZE}rem;
  font-weight: normal;
`

export const ErrorDescription = styled.div`
  color: ${zdColorRed500};
  font-size: ${12 / FONT_SIZE}rem;
`

export const FileSize = styled.div`
  font-size: ${12 / FONT_SIZE}rem;
  color: ${zdColorGrey600};
`

export const StyledAlert = styled(Alert)`
  padding: ${10 / FONT_SIZE}rem !important;
  border-radius: ${4 / FONT_SIZE}rem;
  background-color: rgba(${zdColorRed500}, 0.1);
  padding-left: ${50 / FONT_SIZE}rem !important;
  border: ${1 / FONT_SIZE}rem solid ${zdColorRed300};
  color: ${zdColorRed500};
  line-height: ${18 / FONT_SIZE}rem;
  background-position-y: ${14 / FONT_SIZE}rem;
  margin-bottom: ${10 / FONT_SIZE}rem !important;
`
