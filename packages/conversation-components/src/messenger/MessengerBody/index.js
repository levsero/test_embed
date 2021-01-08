import styled from 'styled-components'

const MessengerBody = styled.div`
  font-family: ${props => props.theme.messenger.fontFamily};
  flex-shrink: 1;
  flex-grow: 1;
  overflow-y: auto;
`

export default MessengerBody
