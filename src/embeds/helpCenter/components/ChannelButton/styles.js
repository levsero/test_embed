import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { FONT_SIZE } from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'
import { Inline } from '@zendeskgarden/react-loaders'

export const ButtonContainer = styled.div`
  position: relative !important;
  margin-top: ${15 / FONT_SIZE}rem;

  ${isMobileBrowser() &&
    `
  margin-top: ${10 / FONT_SIZE}rem !important;
  margin-bottom: ${10 / FONT_SIZE}rem !important;
  width: 100%;
  `}
`

export const StyledButton = styled(Button)`
  padding-right: ${10 / FONT_SIZE}rem !important;
  padding-left: ${10 / FONT_SIZE}rem !important;

  ${!isMobileBrowser() &&
    `
  max-width: ${200 / FONT_SIZE}rem;
  `}
  ${isMobileBrowser() &&
    `
  width: 100%;
  `}
`

export const Loading = styled(Inline)`
  color: ${props => props.theme.buttonTextColorStr} !important;
`
