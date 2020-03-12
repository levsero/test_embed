import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from 'src/redux/modules/base/base-actions'
import * as actionTypes from 'src/redux/modules/base/base-action-types'
import * as selectors from 'src/redux/modules/selectors'
import * as helpCenterSelectors from 'embeds/helpCenter/selectors'
import * as supportSelectors from 'embeds/support/selectors'
import * as submitTicketSelectors from 'src/redux/modules/submitTicket/submitTicket-selectors'
import history from 'service/history'
import { UPDATE_CHAT_SCREEN } from 'src/redux/modules/chat/chat-action-types'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'

jest.mock('src/redux/modules/selectors')
jest.mock('src/redux/modules/base/base-selectors')
jest.mock('embeds/helpCenter/selectors')
jest.mock('embeds/support/selectors')
jest.mock('src/redux/modules/submitTicket/submitTicket-selectors')
jest.mock('service/history')

const mockState = {
  base: {
    hasWidgetShown: false,
    embeds: {
      chat: {}
    }
  }
}

const mockStore = configureMockStore([thunk])

const dispatchAction = action => {
  const store = mockStore(mockState)

  store.dispatch(action)

  return store.getActions()
}

describe('onCancelClick', () => {
  const setEmbedAvailability = ({
    answerBotAvailable = true,
    helpCenterAvailable = true,
    channelChoiceAvailable = true
  }) => {
    jest.spyOn(selectors, 'getAnswerBotAvailable').mockReturnValue(answerBotAvailable)
    jest.spyOn(selectors, 'getHelpCenterAvailable').mockReturnValue(helpCenterAvailable)
    jest.spyOn(selectors, 'getChannelChoiceAvailable').mockReturnValue(channelChoiceAvailable)
  }

  describe('when answerbot is available', () => {
    it('updates active embed to Answerbot, hides back button, and resets history', () => {
      setEmbedAvailability({ answerBotAvailable: true })
      const dispatchedActions = dispatchAction(actions.onCancelClick())

      expect(dispatchedActions).toEqual([
        {
          type: actionTypes.UPDATE_BACK_BUTTON_VISIBILITY,
          payload: false
        },
        {
          type: actionTypes.UPDATE_ACTIVE_EMBED,
          payload: 'answerBot'
        }
      ])

      expect(history.replace).toHaveBeenCalledWith('/')
    })
  })

  describe('when help center is available', () => {
    it('updates active embed to HelpCenter and shows back button', () => {
      setEmbedAvailability({ answerBotAvailable: false, helpCenterAvailable: true })
      jest.spyOn(helpCenterSelectors, 'getArticleViewActive').mockReturnValue(true)

      const dispatchedActions = dispatchAction(actions.onCancelClick())

      expect(dispatchedActions).toEqual([
        {
          type: actionTypes.UPDATE_ACTIVE_EMBED,
          payload: 'helpCenterForm'
        },
        {
          type: actionTypes.UPDATE_BACK_BUTTON_VISIBILITY,
          payload: true
        }
      ])
    })

    it('does not call goBack on history when getNewSupportEmbedEnabled is false', () => {
      jest.spyOn(supportSelectors, 'getNewSupportEmbedEnabled').mockReturnValue(false)

      dispatchAction(actions.onCancelClick())

      expect(history.goBack).not.toHaveBeenCalled()
    })

    it('does call goBack on history when getNewSupportEmbedEnabled is true', () => {
      jest.spyOn(supportSelectors, 'getNewSupportEmbedEnabled').mockReturnValue(true)
      jest.spyOn(submitTicketSelectors, 'getTicketForms').mockReturnValue([])

      dispatchAction(actions.onCancelClick())

      expect(history.goBack).toHaveBeenCalled()
    })

    it('calls goBack on history twice when there are multiple ticket forms', () => {
      jest.spyOn(supportSelectors, 'getNewSupportEmbedEnabled').mockReturnValue(true)
      jest.spyOn(submitTicketSelectors, 'getTicketForms').mockReturnValue([{ id: 1 }, { id: 2 }])

      dispatchAction(actions.onCancelClick())

      expect(history.goBack).toHaveBeenCalledTimes(2)
    })
  })

  describe('when channel choice is available', () => {
    it('updates active embed to ChannelChoice and hides back button', () => {
      setEmbedAvailability({
        answerBotAvailable: false,
        helpCenterAvailable: false,
        channelChoiceAvailable: true
      })
      const dispatchedActions = dispatchAction(actions.onCancelClick())

      expect(dispatchedActions).toEqual([
        {
          type: actionTypes.UPDATE_ACTIVE_EMBED,
          payload: 'channelChoice'
        },
        {
          type: actionTypes.UPDATE_BACK_BUTTON_VISIBILITY,
          payload: false
        }
      ])
    })
  })

  describe('when no embed is available', () => {
    it('dispatches CANCEL_BUTTON_CLICKED', () => {
      setEmbedAvailability({
        channelChoiceAvailable: false,
        answerBotAvailable: false,
        helpCenterAvailable: false
      })
      const dispatchedActions = dispatchAction(actions.onCancelClick())

      expect(dispatchedActions).toEqual([
        {
          type: actionTypes.CANCEL_BUTTON_CLICKED
        }
      ])
    })
  })
})

describe('updateActiveEmbed', () => {
  it('dispatches an action of type UPDATE_ACTIVE_EMBED with the payload', () => {
    const dispatchedActions = dispatchAction(actions.updateActiveEmbed('chat'))

    expect(dispatchedActions[0]).toEqual({
      type: actionTypes.UPDATE_ACTIVE_EMBED,
      payload: 'chat'
    })
  })
})

describe('updateBackButtonVisibility', () => {
  it('dispatches an action of type UPDATE_BACK_BUTTON_VISIBILITY with the payload', () => {
    const dispatchedActions = dispatchAction(actions.updateBackButtonVisibility(true))

    expect(dispatchedActions[0]).toEqual({
      type: actionTypes.UPDATE_BACK_BUTTON_VISIBILITY,
      payload: true
    })
  })
})

describe('onHelpCenterNextClick', () => {
  describe('when channel choice is available', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getChannelChoiceAvailable').mockReturnValue(true)
    })

    it('dispatches updateActiveEmbed with channel choice', () => {
      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[0]).toEqual({
        type: actionTypes.UPDATE_ACTIVE_EMBED,
        payload: 'channelChoice'
      })
    })

    it("dispatches updateBackButtonVisibility when helpCenter isn't available", () => {
      jest.spyOn(selectors, 'getHelpCenterAvailable').mockReturnValue(true)

      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[1].type).toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY)
    })

    it('does not dispatch updateBackButtonVisibility when helpCenter is available', () => {
      jest.spyOn(selectors, 'getHelpCenterAvailable').mockReturnValue(false)

      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[1].type).not.toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY)
    })
  })

  describe('when chat is available', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getChannelChoiceAvailable').mockReturnValue(false)
      jest.spyOn(selectors, 'getChatAvailable').mockReturnValue(true)
    })

    it('dispatches updateActiveEmbed with chat', () => {
      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[0]).toEqual({
        type: actionTypes.UPDATE_ACTIVE_EMBED,
        payload: 'chat'
      })
    })

    it('dispatchs updateBackButtonVisibility', () => {
      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[1].type).toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY)
    })
  })

  describe('when talk is available', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getChannelChoiceAvailable').mockReturnValue(false)
      jest.spyOn(selectors, 'getChatAvailable').mockReturnValue(false)
      jest.spyOn(selectors, 'getTalkOnline').mockReturnValue(true)
    })

    it('dispatches updateActiveEmbed with talk', () => {
      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[0]).toEqual({
        type: actionTypes.UPDATE_ACTIVE_EMBED,
        payload: 'talk'
      })
    })

    it('dispatchs updateBackButtonVisibility', () => {
      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[1].type).toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY)
    })
  })

  describe('when none of the other channels are available', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getChannelChoiceAvailable').mockReturnValue(false)
      jest.spyOn(selectors, 'getChatAvailable').mockReturnValue(false)
      jest.spyOn(selectors, 'getTalkOnline').mockReturnValue(false)
    })

    it('dispatches updateActiveEmbed with submitTicket', () => {
      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[0]).toEqual({
        type: actionTypes.UPDATE_ACTIVE_EMBED,
        payload: 'ticketSubmissionForm'
      })
    })

    it("dispatches updateBackButtonVisibility when helpCenter isn't available", () => {
      jest.spyOn(selectors, 'getHelpCenterAvailable').mockReturnValue(true)

      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[1].type).toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY)
    })

    it('does not dispatch updateBackButtonVisibility when helpCenter is available', () => {
      jest.spyOn(selectors, 'getHelpCenterAvailable').mockReturnValue(false)

      const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

      expect(dispatchedActions[1].type).not.toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY)
    })

    it('does not push anything to history when getNewSupportEmbedEnabled is false', () => {
      jest.spyOn(supportSelectors, 'getNewSupportEmbedEnabled').mockReturnValue(false)

      dispatchAction(actions.onHelpCenterNextClick())

      expect(history.push).not.toHaveBeenCalled()
    })

    it('pushes /support to history when getNewSupportEmbedEnabled is true', () => {
      jest.spyOn(supportSelectors, 'getNewSupportEmbedEnabled').mockReturnValue(true)

      dispatchAction(actions.onHelpCenterNextClick())

      expect(history.push).toHaveBeenCalledWith('/support')
    })
  })

  it('dispatchs onNextClick', () => {
    const dispatchedActions = dispatchAction(actions.onHelpCenterNextClick())

    expect(dispatchedActions[1]).toEqual({
      type: actionTypes.NEXT_BUTTON_CLICKED
    })
  })
})

describe('showChat', () => {
  it('dispatches updateActiveEmbed with chat', () => {
    const dispatchedActions = dispatchAction(actions.showChat())

    expect(dispatchedActions[0]).toEqual({
      type: actionTypes.UPDATE_ACTIVE_EMBED,
      payload: 'chat'
    })
  })

  it('dispatches updateChatScreen when the proactive option is passed in', () => {
    const dispatchedActions = dispatchAction(actions.showChat({ proactive: true }))

    expect(dispatchedActions[1]).toEqual({
      type: UPDATE_CHAT_SCREEN,
      payload: { screen: CHATTING_SCREEN }
    })
  })

  it('does not dispatch updateChatScreen when the proactive option is not passed in', () => {
    const dispatchedActions = dispatchAction(actions.showChat())

    expect(dispatchedActions[1]).toBeUndefined()
  })
})

describe('onChannelChoiceNextClick', () => {
  it('dispatches updateBackButtonVisibility with true', () => {
    const dispatchedActions = dispatchAction(actions.onChannelChoiceNextClick())

    expect(dispatchedActions[0]).toEqual({
      type: actionTypes.UPDATE_BACK_BUTTON_VISIBILITY,
      payload: true
    })
  })

  it('when the passed in value is chat it dispatches updateActiveEmbed with chat', () => {
    const dispatchedActions = dispatchAction(actions.onChannelChoiceNextClick('chat'))

    expect(dispatchedActions[1]).toEqual({
      type: actionTypes.UPDATE_ACTIVE_EMBED,
      payload: 'chat'
    })
  })

  it('when the passed in value is not chat it dispatches updateActiveEmbed with that value', () => {
    const dispatchedActions = dispatchAction(actions.onChannelChoiceNextClick('talk'))

    expect(dispatchedActions[1]).toEqual({
      type: actionTypes.UPDATE_ACTIVE_EMBED,
      payload: 'talk'
    })
  })

  it('does not push anything to history when getNewSupportEmbedEnabled is false', () => {
    jest.spyOn(supportSelectors, 'getNewSupportEmbedEnabled').mockReturnValue(false)

    dispatchAction(actions.onChannelChoiceNextClick('ticketSubmissionForm'))

    expect(history.push).not.toHaveBeenCalled()
  })

  it('pushes /support to history when getNewSupportEmbedEnabled is true', () => {
    jest.spyOn(supportSelectors, 'getNewSupportEmbedEnabled').mockReturnValue(true)

    dispatchAction(actions.onChannelChoiceNextClick('ticketSubmissionForm'))

    expect(history.push).toHaveBeenCalledWith('/support')
  })
})
