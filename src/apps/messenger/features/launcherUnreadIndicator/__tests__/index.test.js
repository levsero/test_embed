import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'

import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import { markAsRead } from 'src/apps/messenger/store/unreadIndicator'

import LauncherUnreadIndicator from '../'

describe('LauncherUnreadIndicator', () => {
  const renderComponent = () => render(<LauncherUnreadIndicator />)

  describe('when launcher is visible', () => {
    it('displays an iframe for the unread indicator when there are unread messages', () => {
      const { queryByTitle, store } = renderComponent()

      const mockMessages = [...new Array(37)].map((_, index) => ({
        _id: index,
        type: 'text',
        text: `Message ${index}`,
        received: 1 + index
      }))

      store.dispatch({
        type: 'messageLog/fetchMessages/fulfilled',
        payload: {
          messages: mockMessages
        }
      })

      expect(queryByTitle('LauncherUnreadIndicator')).toBeInTheDocument()

      store.dispatch(markAsRead({ lastMessageTimestamp: 38 }))

      expect(queryByTitle('LauncherUnreadIndicator')).not.toBeInTheDocument()
    })
  })

  describe('when launcher is not visible', () => {
    it('is not shown', () => {
      const { queryByTitle, store } = renderComponent()
      store.dispatch(screenDimensionsChanged({ isVerticallySmallScreen: true }))

      expect(queryByTitle('LauncherUnreadIndicator')).not.toBeInTheDocument()
    })
  })
})
