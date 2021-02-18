import styled from 'styled-components'
import { zdColorGrey300 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  display: flex;
  align-items: center;
  box-shadow: 0 ${(props) => -1 / props.theme.fontSize}rem 0 0 ${zdColorGrey300};
  padding: ${(props) => 10 / props.theme.fontSize}rem 0;
`

const InputContainer = styled.div`
  flex-grow: 1;
`
export { Container, InputContainer }
