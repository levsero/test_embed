import {
  WIDGET_OPENED_EVENT,
  WIDGET_CLOSED_EVENT,
  CHAT_CONNECTED_EVENT,
  CHAT_DEPARTMENT_STATUS_EVENT,
} from 'constants/event'
import * as callbacks from '../callbacks'

test('invalid event name', () => {
  const callbackSpy = jest.fn()

  callbacks.registerCallback(callbackSpy, WIDGET_OPENED_EVENT)
  callbacks.fireFor('yolo')

  expect(callbackSpy).not.toHaveBeenCalled()
})

describe('valid event', () => {
  test('callbacks registered', () => {
    const callbackSpyOne = jest.fn()
    const callbackSpyTwo = jest.fn()

    callbacks.registerCallback(callbackSpyOne, WIDGET_OPENED_EVENT)
    callbacks.registerCallback(callbackSpyTwo, WIDGET_OPENED_EVENT)
    callbacks.fireFor(WIDGET_OPENED_EVENT)

    expect(callbackSpyOne).toHaveBeenCalled()
    expect(callbackSpyTwo).toHaveBeenCalled()
  })

  test('callback not registered', () => {
    const callbackSpy = jest.fn()

    callbacks.registerCallback(callbackSpy, WIDGET_OPENED_EVENT)
    callbacks.fireFor(WIDGET_CLOSED_EVENT)

    expect(callbackSpy).not.toHaveBeenCalled()
  })

  test('multiple callbacks registered for multiple events', () => {
    const callbackSpys = [jest.fn(), jest.fn(), jest.fn(), jest.fn()]
    const events = [
      WIDGET_OPENED_EVENT,
      WIDGET_OPENED_EVENT,
      WIDGET_CLOSED_EVENT,
      CHAT_CONNECTED_EVENT,
    ]
    const runExpectedCalls = (statuses) => {
      statuses.forEach((status, i) => {
        if (status) {
          expect(callbackSpys[i]).toHaveBeenCalled()
        } else {
          expect(callbackSpys[i]).not.toHaveBeenCalled()
        }
      })
    }

    events.forEach((event, i) => {
      callbacks.registerCallback(callbackSpys[i], event)
    })

    callbacks.fireFor(WIDGET_CLOSED_EVENT)
    runExpectedCalls([false, false, true, false])
    callbackSpys.forEach((cb) => cb.mockClear())

    callbacks.fireFor(WIDGET_OPENED_EVENT)
    runExpectedCalls([true, true, false, false])
    callbackSpys.forEach((cb) => cb.mockClear())

    callbacks.fireFor(CHAT_CONNECTED_EVENT)
    runExpectedCalls([false, false, false, true])
  })

  test('fireFor with arguments', () => {
    const callbackSpy = jest.fn()

    callbacks.registerCallback(callbackSpy, CHAT_DEPARTMENT_STATUS_EVENT)
    callbacks.fireFor(CHAT_DEPARTMENT_STATUS_EVENT, ['yeet', 10])

    expect(callbackSpy).toHaveBeenCalledWith('yeet', 10)
  })
})
