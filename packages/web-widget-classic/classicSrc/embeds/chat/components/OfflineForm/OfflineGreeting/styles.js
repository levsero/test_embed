import Linkify from 'react-linkify'
import styled from 'styled-components'

const OfflineGreetingLink = styled(Linkify)`
  margin-top: ${(props) => 5 / props.theme.fontSize}rem !important;
  display: block;
  white-space: pre-wrap;
  margin-bottom: ${(props) => 9 / props.theme.fontSize}rem;
`

export { OfflineGreetingLink }
