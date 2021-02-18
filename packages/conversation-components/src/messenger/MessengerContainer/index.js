import styled from 'styled-components'
import { rem } from 'polished'

const MessengerContainer = styled.div.attrs((props) => {
  if (props.theme?.rtl !== undefined) {
    return { dir: props.theme.rtl ? 'rtl' : 'ltr' }
  }
})`
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${(props) => rem('380px', props.theme.messenger.baseFontSize)};
  height: ${(props) => rem('700px', props.theme.messenger.baseFontSize)};
  flex: 1;
  border: 0;
  box-shadow: 0px 4px 8px #e0e0e0;
  background-color: #fff;
  overflow: hidden;
`

export default MessengerContainer
