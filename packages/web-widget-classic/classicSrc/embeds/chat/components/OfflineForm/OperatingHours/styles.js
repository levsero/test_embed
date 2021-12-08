import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import { Button } from '@zendeskgarden/react-buttons'

const OperatingHoursLink = styled(Button)`
  &&& {
    color: ${zdColorGrey800} !important;
    cursor: pointer;
    text-decoration: underline !important;

    display: block !important;
    line-height: 1em !important;
    height: auto !important;
    margin-bottom: ${(props) => 9 / props.theme.fontSize}rem;

    &:hover {
      text-decoration: none !important;
    }
  }
`

export { OperatingHoursLink }
