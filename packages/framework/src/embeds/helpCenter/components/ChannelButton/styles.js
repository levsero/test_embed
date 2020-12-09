import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { FONT_SIZE } from 'constants/shared'
import { Dots } from '@zendeskgarden/react-loaders'

export const ButtonContainer = styled.div`
  position: relative !important;
`

export const StyledButton = styled(Button)`
  max-width: ${200 / FONT_SIZE}rem;
`

export const Loading = styled(Dots)`
  color: ${props => props.theme.buttonTextColorStr} !important;
`
