import { submitPrechatForm } from 'src/embeds/chat/actions/prechat-form'
import {
  clearDepartment,
  handlePrechatFormSubmit,
  sendMsg,
  sendOfflineMessage,
  setDepartment,
  setVisitorInfo,
  updateChatScreen,
} from 'src/redux/modules/chat'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import { getDepartment } from 'src/redux/modules/chat/chat-selectors'
import { createMockStore } from 'utility/testHelpers'

jest.mock('src/redux/modules/chat')
jest.mock('src/redux/modules/chat/chat-selectors')

describe('submitPrechatForm', () => {
  beforeEach(() => {
    // Since most chat actions are either thunks or interact with the chat sdk,
    // here they are all mocked out to return simple actions to test against

    handlePrechatFormSubmit.mockImplementation((values) => ({
      type: 'handle prechat form submit',
      values,
    }))
    setVisitorInfo.mockImplementation((values) => ({ type: 'set visitor info', values }))
    sendOfflineMessage.mockImplementation((values) => ({
      type: 'offline message',
      payload: { values },
    }))
    updateChatScreen.mockImplementation((screen) => ({ type: 'update screen', screen }))
    setDepartment.mockImplementation((departmentId) => ({ type: 'set department', departmentId }))
    clearDepartment.mockReturnValue({ type: 'clear department' })
    sendMsg.mockImplementation((message) => ({ type: 'send message', message }))
  })

  describe('when the selected department is offline', () => {
    let store

    beforeEach(() => {
      getDepartment.mockReturnValue({
        id: 123,
        status: 'offline',
      })

      store = createMockStore()

      store.dispatch(
        submitPrechatForm({
          values: {
            name: 'Some name',
            department: 123,
          },
        })
      )
    })

    it('sends an offline message to that department', () => {
      const dispatchedActions = store.getActions()

      expect(dispatchedActions).toContainEqual({
        type: 'offline message',
        payload: {
          values: {
            name: 'Some name',
            department: 123,
          },
        },
      })
    })

    it('navigates to the offline success on successful send of the offline message', () => {
      const dispatchedActions = store.getActions()
      const onSuccess = sendOfflineMessage.mock.calls[0][1]

      onSuccess()

      expect(dispatchedActions).toContainEqual(
        updateChatScreen(screens.OFFLINE_MESSAGE_SUCCESS_SCREEN)
      )
    })

    it('navigates back to the prechat screen on failed send of the offline message', () => {
      const dispatchedActions = store.getActions()
      const onFail = sendOfflineMessage.mock.calls[0][2]

      onFail()

      expect(dispatchedActions).toContainEqual(updateChatScreen(screens.PRECHAT_SCREEN))
    })
  })

  describe('when the department field is visible to the user', () => {
    it('sets the department if one was selected and it exists', () => {
      getDepartment.mockReturnValue({
        id: 123,
      })

      const store = createMockStore()

      store.dispatch(
        submitPrechatForm({
          values: {
            department: 123,
          },
          isDepartmentFieldVisible: true,
        })
      )

      const dispatchedActions = store.getActions()

      expect(dispatchedActions).toContainEqual(setDepartment(123))
    })

    it('clears the department if none were selected', () => {
      getDepartment.mockReturnValue(undefined)

      const store = createMockStore()

      store.dispatch(
        submitPrechatForm({
          values: {
            department: null,
          },
          isDepartmentFieldVisible: true,
        })
      )

      const dispatchedActions = store.getActions()

      expect(dispatchedActions).toContainEqual(clearDepartment())
    })

    it('clears the department if the selected department does not exist', () => {
      getDepartment.mockReturnValue(undefined)

      const store = createMockStore()

      store.dispatch(
        submitPrechatForm({
          values: {
            department: 123,
          },
          isDepartmentFieldVisible: true,
        })
      )

      const dispatchedActions = store.getActions()

      expect(dispatchedActions).toContainEqual(clearDepartment())
    })
  })

  it('sends a message if one was provided', () => {
    const store = createMockStore()

    store.dispatch(
      submitPrechatForm({
        values: {
          message: 'This is a message',
        },
      })
    )

    const dispatchedActions = store.getActions()

    expect(dispatchedActions).toContainEqual(sendMsg('This is a message'))
  })

  it('updates the visitor information if any personal information was provided', async () => {
    const store = createMockStore()

    await store.dispatch(
      submitPrechatForm({
        values: {
          name: 'Someone',
          email: null,
          phone: 123,
        },
      })
    )

    const dispatchedActions = store.getActions()

    expect(dispatchedActions).toContainEqual(
      setVisitorInfo({
        display_name: 'Someone',
        phone: 123,
      })
    )
  })

  it('dispatches an action to signify the prechat form has been submitted', async () => {
    const store = createMockStore()

    const values = {
      name: 'Someone',
      email: null,
      phone: 123,
    }

    await store.dispatch(
      submitPrechatForm({
        values,
      })
    )

    const dispatchedActions = store.getActions()

    expect(dispatchedActions).toContainEqual(handlePrechatFormSubmit(values))
  })
})
