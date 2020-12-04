import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'

const ChatEndModalDescription = styled.div`
  color: ${zdColorGrey800};
  &&& {
    padding-bottom: ${props => 20 / props.theme.fontSize}rem !important;
  }
`

export { ChatEndModalDescription }
