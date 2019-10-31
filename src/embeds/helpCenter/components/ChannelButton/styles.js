import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { FONT_SIZE } from 'constants/shared'
import { Inline } from '@zendeskgarden/react-loaders'

export const ButtonContainer = styled.div`
  position: relative !important;
`

export const StyledButton = styled(Button)`
  padding-right: ${10 / FONT_SIZE}rem !important;
  padding-left: ${10 / FONT_SIZE}rem !important;
  max-width: ${200 / FONT_SIZE}rem;
`

export const Loading = styled(Inline)`
  color: ${props => props.theme.buttonTextColorStr} !important;
`
