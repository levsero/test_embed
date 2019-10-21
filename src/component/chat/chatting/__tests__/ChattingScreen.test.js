import { Component as ChattingScreen } from '../ChattingScreen'
import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'

const sendAttachmentsSpy = jest.fn(),
  showChatEndSpy = jest.fn(),
  sendMsgSpy = jest.fn(),
  handleChatBoxChangeSpy = jest.fn(),
  sendChatRatingSpy = jest.fn(),
  updateChatScreenSpy = jest.fn(),
  toggleMenuSpy = jest.fn(),
  markAsReadSpy = jest.fn()
const renderComponent = (inProps, renderer) => {
  const props = {
    lastMessageAuthor: 'bob',
    currentMessage: 'hello',
    sendAttachments: sendAttachmentsSpy,
    showChatEndFn: showChatEndSpy,
    sendMsg: sendMsgSpy,
    handleChatBoxChange: handleChatBoxChangeSpy,
    sendChatRating: sendChatRatingSpy,
    updateChatScreen: updateChatScreenSpy,
    isChatting: false,
    toggleMenu: toggleMenuSpy,
    showAvatar: false,
    title: '',
    markAsRead: markAsReadSpy,
    unreadMessages: false,

    ...inProps
  }

  const component = (
    <Provider store={createStore()}>
      <ChattingScreen {...props} />
    </Provider>
  )

  if (renderer) {
    return renderer(component)
  } else {
    return render(component)
  }
}

describe('markAsRead', () => {
  it('when unreadMessages exist, component is visible, call markAsRead', () => {
    const { rerender } = renderComponent()

    renderComponent({ visible: true, unreadMessages: true }, rerender)
    expect(markAsReadSpy).toHaveBeenCalled()
    markAsReadSpy.mockRestore()
  })

  it('when unreadMessages do exist but it is not visible, do not call markAsRead', () => {
    const { rerender } = renderComponent()

    renderComponent({ visible: false, unreadMessages: true }, rerender)
    expect(markAsReadSpy).not.toHaveBeenCalled()
  })
})
