import mockZChat from 'src/redux/modules/chat/helpers/mockZChat'
import { win } from 'utility/globals'

const loadZChat = (m) => {
  const zChat = mockZChat(m)
  win.zChat = zChat
  return zChat
}

export default loadZChat
