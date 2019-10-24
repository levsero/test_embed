import React from 'react'
import { Component as ChatHistoryScreen } from '../'
import snapshotDiff from 'snapshot-diff'
import { render } from 'src/util/testHelpers'

jest.mock('component/chat/chatting/HistoryLog')

const renderChatHistoryScreen = (customProps = {}) => {
  const defaultProps = {
    historyLength: 2,
    hasMoreHistory: false,
    historyRequestStatus: 'done',
    isMobile: false,
    allAgents: {},
    showAvatar: false,
    fetchConversationHistory: noop,
    hideZendeskLogo: false,
    chatId: 'id-1012',
    firstMessageTimestamp: 1555030483758,
    fullscreen: false,
    title: 'this is the title'
  }

  const props = {
    ...defaultProps,
    ...customProps
  }

  return render(<ChatHistoryScreen {...props} />)
}

describe('ChatHistoryScreen', () => {
  let result, defaultProps

  describe('when not mobile', () => {
    beforeEach(() => {
      result = renderChatHistoryScreen().container
    })

    it('renders ChatHistory', () => {
      expect(result).toMatchSnapshot()
    })
  })

  describe('when mobile', () => {
    beforeEach(() => {
      defaultProps = renderChatHistoryScreen().container
      result = renderChatHistoryScreen({ isMobile: true }).container
    })

    it('renders mobile classes', () => {
      expect(snapshotDiff(defaultProps, result, { contextLines: 2 })).toMatchSnapshot()
    })
  })

  describe('when hideZendeskLogo is true', () => {
    beforeEach(() => {
      defaultProps = renderChatHistoryScreen().container
      result = renderChatHistoryScreen({ hideZendeskLogo: true }).container
    })

    it('has no logo and correct margin', () => {
      expect(snapshotDiff(defaultProps, result, { contextLines: 2 })).toMatchSnapshot()
    })
  })
})
