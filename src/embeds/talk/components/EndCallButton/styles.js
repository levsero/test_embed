import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { zdColorRed600, zdColorWhite } from '@zendeskgarden/css-variables'

const EndCallButton = styled(Button)`
  &&& {
    width: 100%;
    background-color: ${zdColorRed600} !important;
    color: ${zdColorWhite} !important;
    border-color: ${zdColorRed600} !important;
    flex-shrink: 0;
  }
`

export { EndCallButton as Button }
