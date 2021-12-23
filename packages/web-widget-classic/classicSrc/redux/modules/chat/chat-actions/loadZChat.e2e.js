import { win } from '@zendesk/widget-shared-services'
import mockZChat from 'classicSrc/redux/modules/chat/helpers/mockZChat'

const loadZChat = (m) => {
  const zChat = mockZChat(m)
  win.zChat = zChat
  return zChat
}

export default loadZChat
