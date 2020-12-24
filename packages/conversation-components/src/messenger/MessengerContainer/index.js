import styled from 'styled-components'
import { rem } from 'polished'

const MessengerContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${props => rem('380px', props.theme.messenger.baseFontSize)};
  height: ${props => rem('700px', props.theme.messenger.baseFontSize)};
  border: 0;
  box-shadow: 0px 4px 8px #e0e0e0;
  background-color: #fff;
`

export default MessengerContainer
