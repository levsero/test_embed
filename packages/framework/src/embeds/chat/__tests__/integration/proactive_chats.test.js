import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'utility/testHelpers'
import WebWidget from 'src/component/webWidget/WebWidget'
import { setStatusForcefully, chatConnected } from 'src/redux/modules/chat/chat-actions'
import { getActiveEmbed, getWebWidgetOpen } from 'src/redux/modules/base/base-selectors'
import { updateSettings } from 'src/redux/modules/settings'
import * as devices from 'src/util/devices'

jest.mock('src/service/transport/http')

jest.useFakeTimers()

const turnChatOnline = (store) => {
  store.dispatch(setStatusForcefully('online'))
  store.dispatch(chatConnected())
}
const sendAgentMessage = (store) => {
  store.dispatch({
    type: 'websdk/chat.msg',
    payload: {
      type: 'chat',
      detail: {
        timestamp: Date.now(),
        nick: 'agent:115806148031',
        type: 'chat.msg',
        display_name: 'Wayner',
        msg: 'hello world',
        options: [],
      },
    },
  })
}

describe('proactive chat', () => {
  describe('desktop', () => {
    it('opens the widget to the chat embed', () => {
      const { store, queryByText } = render(<WebWidget isMobile={false} />)
      turnChatOnline(store)
      expect(getWebWidgetOpen(store.getState())).toBeFalsy()
      expect(queryByText('Chat with us')).not.toBeInTheDocument()

      sendAgentMessage(store)

      expect(queryByText('Chat with us')).toBeInTheDocument()
      expect(getWebWidgetOpen(store.getState())).toBeTruthy()
      expect(getActiveEmbed(store.getState())).toEqual('chat')
    })
  })

  describe('mobile', () => {
    beforeEach(() => jest.spyOn(devices, 'isMobileBrowser').mockReturnValue(true))

    const setup = () => {
      const utils = render(<WebWidget isMobile={true} />)
      const { store } = utils
      turnChatOnline(store)
      sendAgentMessage(store)
      return utils
    }

    it('shows the standalone chat notification', () => {
      const { queryByText } = setup()
      expect(queryByText('hello world')).toBeInTheDocument()
    })

    it('closes the chat notification after a certain time has passed', () => {
      const { queryByText } = setup()
      expect(queryByText('hello world')).toBeInTheDocument()
      jest.runAllTimers()
      expect(queryByText('hello world')).not.toBeInTheDocument()
    })

    it('allows dismissing of chat notification', () => {
      const { getByText, queryByText } = setup()
      expect(getByText('hello world')).toBeInTheDocument()
      fireEvent.click(getByText('Dismiss'))
      expect(queryByText('hello world')).not.toBeInTheDocument()
    })

    it('allows replying to chat notification', () => {
      const { getByText, queryByText } = setup()
      fireEvent.click(getByText('Reply'))
      expect(queryByText('Chat with us')).toBeInTheDocument()
    })

    it('allows disabling of chat notifications via api', () => {
      const { store, queryByText } = render(<WebWidget isMobile={true} />)
      turnChatOnline(store)
      store.dispatch(
        updateSettings({
          chat: {
            notifications: {
              mobile: { disable: true },
            },
          },
        })
      )

      sendAgentMessage(store)
      expect(queryByText('hello world')).not.toBeInTheDocument()
    })
  })
})
