import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import { Button } from '@zendeskgarden/react-buttons'

const StyledButton = styled(Button)`
  width: 100%;
`

const Greeting = styled.p`
  margin-top: ${props => 6 / props.theme.fontSize}rem;
  font-size: ${props => 15 / props.theme.fontSize}rem;
  color: ${zdColorGrey800};
  flex-grow: 1;
`

const InnerContentContainer = styled.div`
  flex-direction: column;
  display: flex;
  padding-bottom: ${props => 25 / props.theme.fontSize}rem;
  height: 100%;
`

export { StyledButton as Button, Greeting, InnerContentContainer }
