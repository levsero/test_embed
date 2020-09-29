import { startTyping, stopTyping } from '../typing'
import * as suncoClient from 'src/apps/messenger/suncoClient'
jest.mock('src/apps/messenger/suncoClient')

jest.useFakeTimers()

describe('typing activity events', () => {
  let mockClient

  beforeEach(() => {
    mockClient = {
      activity: {
        startTyping: jest.fn(),
        stopTyping: jest.fn()
      }
    }

    jest.spyOn(suncoClient, 'getClient').mockReturnValue(mockClient)
  })

  it('sends a start typing event if user was not previously typing', () => {
    startTyping()

    expect(mockClient.activity.startTyping).toHaveBeenCalled()
  })

  it('sends a stop typing event 10 seconds after the user stopped typing', () => {
    startTyping()

    jest.advanceTimersByTime(7000)
    startTyping()

    jest.advanceTimersByTime(4000)
    expect(mockClient.activity.stopTyping).not.toHaveBeenCalled()

    jest.advanceTimersByTime(6000)
    expect(mockClient.activity.stopTyping).toHaveBeenCalled()
  })

  it('sends a stop typing event if manually cancelled', () => {
    startTyping()
    jest.advanceTimersByTime(5000)

    stopTyping()
    expect(mockClient.activity.stopTyping).toHaveBeenCalled()

    jest.advanceTimersByTime(5000)

    expect(mockClient.activity.stopTyping).toHaveBeenCalledTimes(1)
  })
})
