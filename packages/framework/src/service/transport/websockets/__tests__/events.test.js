import * as actions from 'src/embeds/talk/actions'
import {
  talkEmbeddableConfigEventToAction,
  talkAgentAvailabilityEventToAction,
  talkAverageWaitTimeEventToAction,
} from '../events'

jest.mock('src/embeds/talk/actions')

const mockSocket = {
  on: jest.fn(),
}

const mockReduxStore = {
  dispatch: jest.fn(),
}

describe('talkEmbeddableConfigEventToAction', () => {
  beforeEach(() => {
    talkEmbeddableConfigEventToAction(mockSocket, mockReduxStore)
  })

  it('calls socket.on with the event name and a callback', () => {
    expect(mockSocket.on).toHaveBeenCalledWith('socket.embeddableConfig', expect.any(Function))
  })

  const getConfig = (configOverrides) => ({
    agentAvailability: false,
    averageWaitTime: '1',
    averageWaitTimeSetting: 'exact',
    averageWaitTimeEnabled: true,
    capability: '0',
    enabled: false,
    nickname: '',
    phoneNumber: '',
    ...configOverrides,
  })

  const getConnectionCallback = () => mockSocket.on.mock.calls[0][1]
  const getDisconnectionCallback = () => mockSocket.on.mock.calls[1][1]

  describe('when the event is fired', () => {
    it('dispatches the updateTalkEmbeddableConfig action', () => {
      const callback = getConnectionCallback()
      callback(getConfig())
      expect(actions.updateTalkEmbeddableConfig).toHaveBeenCalledWith({
        agentAvailability: false,
        averageWaitTime: '1',
        averageWaitTimeSetting: 'exact',
        averageWaitTimeEnabled: true,
        capability: '0',
        enabled: false,
        nickname: '',
        phoneNumber: '',
      })
    })
  })

  describe('when the disconnect socket event is fired', () => {
    it('dispatches the talkDisconnect action', () => {
      const disconnectionCallback = getDisconnectionCallback()

      disconnectionCallback()

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
        averageWaitTimeEnabled: true,
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
