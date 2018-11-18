import { socketio } from '../socketio';
import { talkEmbeddableConfigEventToAction,
  talkAgentAvailabilityEventToAction,
  talkAverageWaitTimeEventToAction } from '../events';

jest.mock('../events');

describe('connect', () => {
  let args,
    io = jest.fn(() => 'mockReturnValue'),
    mockTalkServiceHostname = 'customer.zendesk.com',
    nickname = 'Service & Support',
    socket;

  beforeEach(() => {
    socket = socketio.connect(io, `https://${mockTalkServiceHostname}`, nickname);
    const calls = io.mock.calls;

    args = calls[calls.length - 1];
  });

  it('calls io with the correct service url', () => {
    expect(args[0])
      .toBe(`https://${mockTalkServiceHostname}`);
  });

  it('calls io with the correct options', () => {
    expect(args[1])
      .toEqual({
        query: 'subdomain=customer&keyword=Service%20%26%20Support',
        path: '/talk_embeddables_service/socket.io',
        reconnectionAttempts: 6,
        transports: ['websocket']
      });
  });

  it('returns the socket', () => {
    expect(socket)
      .toBe('mockReturnValue');
  });
});

describe('mapEventsToActions', () => {
  const socket = { on: () => {} };
  const reduxStore = { state: {} };

  beforeEach(() => {
    socketio.mapEventsToActions(socket, reduxStore);
  });

  it('calls talkEmbeddableConfigEventToAction with socket and reduxStore', () => {
    expect(talkEmbeddableConfigEventToAction)
      .toHaveBeenCalledWith(socket, reduxStore);
  });

  it('calls talkAgentAvailabilityEventToAction with socket and reduxStore', () => {
    expect(talkAgentAvailabilityEventToAction)
      .toHaveBeenCalledWith(socket, reduxStore);
  });

  it('calls talkAverageWaitTimeEventToAction with socket and reduxStore', () => {
    expect(talkAverageWaitTimeEventToAction)
      .toHaveBeenCalledWith(socket, reduxStore);
  });
});
