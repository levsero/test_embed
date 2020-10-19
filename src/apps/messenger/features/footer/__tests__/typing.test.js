import { startTyping, stopTyping, cancelTyping } from '../typing'
import * as suncoClient from 'src/apps/messenger/api/sunco'
jest.mock('src/apps/messenger/api/sunco')
jest.useFakeTimers()

describe('typing activity events', () => {
  it('sends a start typing event if user was not previously typing', () => {
    startTyping()

    expect(suncoClient.sendStartTyping).toHaveBeenCalled()

    cancelTyping()
  })

  it('does not send a stop typing event when typing was cancelled', () => {
    startTyping()
    cancelTyping()

    jest.advanceTimersByTime(4000)

    expect(suncoClient.sendStartTyping).toHaveBeenCalled()
    expect(suncoClient.sendStopTyping).not.toHaveBeenCalled()
  })

  it('sends a stop typing event 10 seconds after the user stopped typing', () => {
    startTyping()

    jest.advanceTimersByTime(7000)
    startTyping()

    jest.advanceTimersByTime(4000)
    expect(suncoClient.sendStopTyping).not.toHaveBeenCalled()

    jest.advanceTimersByTime(6000)
    expect(suncoClient.sendStopTyping).toHaveBeenCalled()
  })

  it('sends a stop typing event if manually cancelled', () => {
    startTyping()
    jest.advanceTimersByTime(5000)

    stopTyping()
    expect(suncoClient.sendStopTyping).toHaveBeenCalled()

    jest.advanceTimersByTime(5000)

    expect(suncoClient.sendStopTyping).toHaveBeenCalledTimes(1)
  })
})
