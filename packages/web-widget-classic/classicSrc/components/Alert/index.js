import styled from 'styled-components'
import { zdColorRed300, zdColorRed500 } from '@zendeskgarden/css-variables'
import { Alert, Title } from '@zendeskgarden/react-notifications'

const StyledAlert = styled(Alert)`
  border-radius: ${(props) => 4 / props.theme.fontSize}rem;
  background-color: rgba(${zdColorRed500}, 0.1);
  border: ${(props) => 1 / props.theme.fontSize}rem solid ${zdColorRed300};
  color: ${zdColorRed500};
  line-height: ${(props) => 20 / props.theme.fontSize}rem;
  margin-bottom: ${(props) => 10 / props.theme.fontSize}rem !important;
`

const StyledTitle = styled(Title)`
  font-size: ${(props) => 14 / props.theme.fontSize}rem;
`

export { StyledAlert as Alert, StyledTitle as Title }
