import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'

const OperatingHoursLink = styled(Button)`
  &&& {
    color: ${zdColorGrey800} !important;
    cursor: pointer;
    text-decoration: underline !important;
    height: inherit !important;
    line-height: inherit !important;
    margin-bottom: ${props => 9 / props.theme.fontSize}rem;

    &:hover {
      text-decoration: none !important;
    }
  }
`

export { OperatingHoursLink }
