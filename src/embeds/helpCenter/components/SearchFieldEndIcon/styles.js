import styled from 'styled-components'
import { Dots } from '@zendeskgarden/react-loaders'
import { IconButton } from '@zendeskgarden/react-buttons'
import { zdColorGrey600, zdColorGrey800 } from '@zendeskgarden/css-variables'

const ClearInputButton = styled(IconButton)`
  color: ${zdColorGrey600} !important;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  max-height: 1rem !important;
  width: 1rem !important;

  &:not(:disabled) {
    &:hover,
    &:active,
    &:focus {
      color: ${zdColorGrey800} !important;
      background-color: transparent !important;
    }

    &&:focus {
      box-shadow: 0 0 0 ${props => 3 / props.theme.fontSize}rem rgba(153, 153, 153, 0.4) !important;
    }
  }
`

const LoadingDots = styled(Dots)`
  color: ${props => props.theme.baseColor} !important;
  width: 1rem !important;
  max-height: 1rem !important;
`

export { LoadingDots, ClearInputButton }
