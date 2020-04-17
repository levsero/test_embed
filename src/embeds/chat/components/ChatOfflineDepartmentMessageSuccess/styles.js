import styled from 'styled-components'
import { zdColorGrey300, zdColorGrey800 } from '@zendeskgarden/css-variables'
import { Button } from '@zendeskgarden/react-buttons'

const BackButton = styled(Button)`
  height: ${props => 38 / props.theme.fontSize}rem;
  max-width: 100%;
  width: 100%;
  margin-top: ${props => 20 / props.theme.fontSize}rem !important;
`

const Info = styled.div`
  padding: ${props => 20 / props.theme.fontSize}rem;
  border: ${props => 1.1 / props.theme.fontSize}rem solid ${zdColorGrey300};
  border-radius: ${props => 4 / props.theme.fontSize}rem;
`

const Message = styled.p`
  margin-top: ${props => 6 / props.theme.fontSize}rem;
  margin-bottom: ${props => 10 / props.theme.fontSize}rem;
`

const OfflineMessage = styled.p`
  margin-top: ${props => 10 / props.theme.fontSize}rem;
  line-height: ${props => 18 / props.theme.fontSize}rem;
`

const SuccessContainer = styled.div`
  font-size: ${props => 15 / props.theme.fontSize}rem;
  line-height: ${props => 20 / props.theme.fontSize}rem;
  color: ${zdColorGrey800};
`

export { BackButton, Info, Message, OfflineMessage, SuccessContainer }
