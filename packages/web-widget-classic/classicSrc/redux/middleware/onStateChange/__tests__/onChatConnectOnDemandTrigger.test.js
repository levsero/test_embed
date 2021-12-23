import { LAUNCHER_CLICKED } from 'classicSrc/redux/modules/base/base-action-types'
import { setUpChat } from 'classicSrc/redux/modules/chat'
import onChatConnectOnDemandTrigger from '../onChatConnectOnDemandTrigger'

jest.mock('classicSrc/redux/modules/chat')

const getAction = (actionType = LAUNCHER_CLICKED) => {
  return {
    type: actionType,
  }
}

const getState = (connectOnDemand = true, chatEnabled = true) => {
  return {
    settings: {
      chat: {
        connectOnDemand,
      },
    },
    base: {
      embeds: {
        chat: chatEnabled,
      },
    },
    chat: {
      config: {},
    },
  }
}

describe('onChatConnectOnDemandTrigger', () => {
  test('when actions are one of the trigger actions it calls setupChat once', () => {
    onChatConnectOnDemandTrigger(getState(), getAction(), jest.fn())
    onChatConnectOnDemandTrigger(getState(), getAction(), jest.fn())

    expect(setUpChat).toHaveBeenCalledTimes(1)
    expect(setUpChat).toHaveBeenCalledWith(false)
  })

  test('when action is not one of the trigger actions it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(), getAction('BLAH'), jest.fn())

    expect(setUpChat).not.toHaveBeenCalled()
  })

  test('when delayChatConnection is false it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(false), getAction(), jest.fn())

    expect(setUpChat).not.toHaveBeenCalled()
  })

  test('when chatEnabled is false it does not call setupChat', () => {
    onChatConnectOnDemandTrigger(getState(true, false), getAction(), jest.fn())

    expect(setUpChat).not.toHaveBeenCalled()
  })
})
