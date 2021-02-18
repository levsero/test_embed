import { win } from 'utility/globals'
import mockZChat from 'src/redux/modules/chat/helpers/mockZChat'

const loadZChat = (m) => {
  const zChat = mockZChat(m)
  win.zChat = zChat
  return zChat
}

export default loadZChat
