import styled from 'styled-components'

const MessageLogList = styled.div`
  font-family: ${props => props.theme.messenger.fontFamily};
  overflow-y: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-grow: 1;
  flex-shrink: 1;
  border: 1px solid #000;
`

export default MessageLogList
