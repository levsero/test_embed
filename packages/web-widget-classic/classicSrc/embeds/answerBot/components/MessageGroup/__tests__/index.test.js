import { TEST_IDS } from 'classicSrc/constants/shared'
import { render } from 'classicSrc/util/testHelpers'
import { Component as MessageGroup } from '../index'

const textMessage = {
  type: 'text',
  message: 'hello',
  author: 'AUTHOR_VISITOR',
  timestamp: Date.now(),
  sessionID: 1234,
}

jest.useFakeTimers()

const messages = [textMessage]

const renderComponent = (props = {}) => {
  const defaultProps = {
    messages: messages,
    isVisitor: false,
    agentAvatarName: 'Answer Bot',
    locale: 'en-US',
  }

  const componentProps = {
    ...defaultProps,
    ...props,
  }

  const utils = render(<MessageGroup {...componentProps} />)

  jest.runAllTimers() // let the animation finish

  return utils
}

test('renders expected classes and components with default props', () => {
  const { queryByText } = renderComponent()

  expect(queryByText('Answer Bot')).toBeInTheDocument()
  expect(queryByText('Bot')).toBeInTheDocument()
})

describe('bot', () => {
  describe('name', () => {
    it('renders agent name', () => {
      const { queryByText } = renderComponent({
        agentAvatarName: 'Bond',
      })

      expect(queryByText('Bond')).toBeInTheDocument()
      expect(queryByText('Bot')).toBeInTheDocument()
    })
  })

  describe('avatar', () => {
    it('renders brand logo', () => {
      const { getByAltText } = renderComponent({
        brandLogoUrl: 'http://url',
      })

      expect(getByAltText('avatar').src).toEqual('http://url/')
    })

    it('renders agent avatar', () => {
      const { getByAltText } = renderComponent({
        agentAvatarUrl: 'http://url',
      })

      expect(getByAltText('avatar').src).toEqual('http://url/')
    })
  })

  describe('messages', () => {
    it('animates messages', () => {
      const messages = [
        { timestamp: 1, text: 'first' },
        { timestamp: 2, text: 'second' },
        { timestamp: 3, text: 'third' },
      ]

      const { getAllByTestId } = render(
        <MessageGroup
          locale={'en-US'}
          lastConversationScreenClosed={1}
          isVisitor={false}
          messages={messages}
        />
      )

      expect(getAllByTestId(TEST_IDS.CHAT_MSG_ANSWER_BOT).length).toEqual(1)

      jest.advanceTimersByTime(1000)
      expect(getAllByTestId(TEST_IDS.CHAT_MSG_ANSWER_BOT).length).toEqual(2)

      jest.advanceTimersByTime(1000)
      expect(getAllByTestId(TEST_IDS.CHAT_MSG_ANSWER_BOT).length).toEqual(3)
    })
  })
})

describe('visitor', () => {
  describe('name and avatar', () => {
    it('does not render avatar', () => {
      const { queryByAltText } = renderComponent({ isVisitor: true })

      expect(queryByAltText('avatar')).not.toBeInTheDocument()
    })
  })

  describe('messages', () => {
    it('runs callbacks of old messages', () => {
      const callback1 = jest.fn(),
        callback3 = jest.fn()
      const messages = [
        { timestamp: 1, text: 'first', callback: callback1 },
        { timestamp: 2, text: 'second' },
        { timestamp: 3, text: 'third', callback: callback3 },
      ]

      renderComponent({
        lastConversationScreenClosed: 1,
        isVisitor: true,
        messages,
      })
      expect(callback1).toHaveBeenCalled()
    })
  })
})
