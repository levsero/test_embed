import React from 'react'
import { render } from 'utility/testHelpers'
import WebWidget from 'src/component/webWidget/WebWidget'
import {
  proactiveMessageReceived,
  setStatusForcefully,
  chatConnected
} from 'src/redux/modules/chat/chat-actions'
import { getActiveEmbed, getWebWidgetVisible } from 'src/redux/modules/base/base-selectors'

jest.mock('src/service/transport/http')

const turnChatOnline = store => {
  store.dispatch(setStatusForcefully('online'))
  store.dispatch(chatConnected())
}

describe('proactive chat', () => {
  describe('desktop', () => {
    it('opens the widget to the chat embed', () => {
      const { store, queryByText } = render(<WebWidget isMobile={false} />)
      turnChatOnline(store)
      expect(getWebWidgetVisible(store.getState())).toBeFalsy()
      expect(queryByText('Chat with us')).not.toBeInTheDocument()

      store.dispatch(proactiveMessageReceived())
      expect(queryByText('Chat with us')).toBeInTheDocument()
      expect(getWebWidgetVisible(store.getState())).toBeTruthy()
      expect(getActiveEmbed(store.getState())).toEqual('chat')
    })
  })
})
