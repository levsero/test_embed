import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  color: ${zdColorGrey800};
  margin-bottom: ${props => 13 / props.theme.fontSize}rem;
  white-space: pre-line;
`

export { Container }
