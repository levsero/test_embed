import styled from 'styled-components'
import { zdColorBlue600 } from '@zendeskgarden/css-variables'

const PhoneLink = styled.a`
  color: ${zdColorBlue600};
  text-decoration: underline;

  &:hover,
  &:focus,
  &:active {
    color: ${zdColorBlue600};
  }
`

export { PhoneLink }
