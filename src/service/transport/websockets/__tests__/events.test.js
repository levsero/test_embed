import {
  talkEmbeddableConfigEventToAction,
  talkAgentAvailabilityEventToAction,
  talkAverageWaitTimeEventToAction
} from '../events'
import * as actions from 'src/redux/modules/talk'

jest.mock('src/redux/modules/talk')

const mockSocket = {
  on: jest.fn()
}

const mockReduxStore = {
  dispatch: jest.fn()
}

describe('talkEmbeddableConfigEventToAction', () => {
  let callback, mockConfig

  beforeEach(() => {
    talkEmbeddableConfigEventToAction(mockSocket, mockReduxStore)
  })

  it('calls socket.on with the event name and a callback', () => {
    expect(mockSocket.on).toHaveBeenCalledWith('socket.embeddableConfig', expect.any(Function))
  })

  describe('when the event is fired', () => {
    beforeEach(() => {
      mockConfig = {
        agentAvailability: false,
        averageWaitTime: '1',
        averageWaitTimeSetting: 'exact',
        averageWaitTimeEnabled: true,
        capability: '0',
        enabled: false,
        nickname: '',
        phoneNumber: ''
      }

      callback = mockSocket.on.mock.calls[0][1]
      callback(mockConfig)
    })

    it('dispatches the updateTalkEmbeddableConfig action', () => {
      expect(actions.updateTalkEmbeddableConfig).toHaveBeenCalledWith(mockConfig)
    })
  })

  describe('when the disconnect socket event is fired', () => {
    beforeEach(() => {
      mockConfig = { enabled: false }

      callback = mockSocket.on.mock.calls[1][1]
      callback()
    })

    it('dispatches the updateTalkEmbeddableConfig action with enabled as false', () => {
      expect(actions.talkDisconnect).toHaveBeenCalled()
    })
  })
})

describe('talkAgentAvailabilityEventToAction', () => {
  beforeEach(() => {
    talkAgentAvailabilityEventToAction(mockSocket, mockReduxStore)
  })

  it('calls socket.on with the event name and a callback', () => {
    expect(mockSocket.on).toHaveBeenCalledWith('socket.availability', expect.any(Function))
  })

  describe('when the event is fired', () => {
    let callback, mockAgentAvailability

    beforeEach(() => {
      mockAgentAvailability = { agentAvailability: true }

      const calls = mockSocket.on.mock.calls

      callback = calls[calls.length - 1][1]
      callback(mockAgentAvailability)
    })

    it('dispatches an agent availability action', () => {
      expect(actions.updateTalkAgentAvailability).toHaveBeenCalledWith(mockAgentAvailability)
    })
  })
})

describe('talkAverageWaitTimeEventToAction', () => {
  beforeEach(() => {
    talkAverageWaitTimeEventToAction(mockSocket, mockReduxStore)
  })

  it('calls socket.on with the event name and a callback', () => {
    expect(mockSocket.on).toHaveBeenCalledWith('socket.waitTimeChange', expect.any(Function))
  })

  describe('when the event is fired', () => {
    let callback, mockData

    beforeEach(() => {
      mockData = {
        averageWaitTime: '1',
        averageWaitTimeSetting: 'exact',
        averageWaitTimeEnabled: true
      }
      const calls = mockSocket.on.mock.calls

      callback = calls[calls.length - 1][1]
      callback(mockData)
    })

    it('dispatches an average wait time change action', () => {
      expect(actions.updateTalkAverageWaitTime).toHaveBeenCalledWith(mockData)
    })
  })
})
