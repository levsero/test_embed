import styled from 'styled-components'
import { Label } from '@zendeskgarden/react-forms'

const FormLabel = styled(Label)`
  line-height: 1.42857 !important;
  display: block;
  margin-bottom: ${(props) => 6 / props.theme.fontSize}rem;
  word-break: break-word;
`

export { FormLabel }
