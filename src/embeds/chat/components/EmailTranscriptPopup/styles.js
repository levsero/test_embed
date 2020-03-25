import styled from 'styled-components'
import { Alert } from 'embeds/support/components/Notifications'

const Form = styled.form`
  ${Alert} {
    margin-top: ${props => 16 / props.theme.fontSize}rem;
    margin-bottom: 0 !important;
  }
`

export { Form }
