import * as selectors from '../talk-selectors';
import { PHONE_ONLY, CALLBACK_ONLY, CALLBACK_AND_PHONE } from '../talk-capability-types';

const embeddableConfig = (state) => (
  {
    talk: {
      embeddableConfig: state
    }
  }
);

const talkConfig = (state) => (
  {
    talk: state
  }
);

test('getEmbeddableConfig returns the embeddableConfig object', () => {
  const state = {
    a: 123
  };

  expect(selectors.getEmbeddableConfig(embeddableConfig(state)))
    .toEqual(state);
});

test('getCapability returns the capability', () => {
  const state = {
    capability: 'abc'
  };

  expect(selectors.getCapability(embeddableConfig(state)))
    .toEqual('abc');
});

test('getEmbeddableConfigEnabled returns if config is enabled', () => {
  const state = {
    enabled: true
  };

  expect(selectors.getEmbeddableConfigEnabled(embeddableConfig(state)))
    .toEqual(true);
});

test('getEmbeddableConfigConnected returns connected', () => {
  const state = {
    connected: true
  };

  expect(selectors.getEmbeddableConfigConnected(embeddableConfig(state)))
    .toEqual(true);
});

test('getAgentAvailability returns the availability', () => {
  const state = {
    agentAvailability: true
  };

  expect(selectors.getAgentAvailability(talkConfig(state)))
    .toEqual(true);
});

test('getFormState returns the form state', () => {
  const state = {
    formState: {
      phone: 'fasdf',
      name: 'blah'
    }
  };

  expect(selectors.getFormState(talkConfig(state)))
    .toEqual(state.formState);
});

test('getScreen returns the form state', () => {
  const state = {
    screen: 'form'
  };

  expect(selectors.getScreen(talkConfig(state)))
    .toEqual('form');
});

test('getScreen returns the form state', () => {
  const state = {
    screen: 'form'
  };

  expect(selectors.getScreen(talkConfig(state)))
    .toEqual('form');
});

test('getCallback returns the callback object', () => {
  const state = {
    callback: {
      blah: true
    }
  };

  expect(selectors.getCallback(talkConfig(state)))
    .toEqual(state.callback);
});

test('getAverageWaitTime returns the callback object', () => {
  const state = {
    averageWaitTime: '5'
  };

  expect(selectors.getAverageWaitTime(talkConfig(state)))
    .toEqual('5');
});

test('getAverageWaitTimeEnabled returns the callback object', () => {
  const state = {
    averageWaitTimeEnabled: true
  };

  expect(selectors.getAverageWaitTimeEnabled(talkConfig(state)))
    .toEqual(true);
});

test('getInitialScreen returns the expected string', () => {
  const state = {
    capability: 'TALK'
  };

  expect(selectors.getInitialScreen(embeddableConfig(state)))
    .toEqual('TALK_SCREEN');
});

test('getSocketIoVendor returns the socket.io vendor', () => {
  const state = {
    vendor: {
      io: {
        blah: 'blah'
      }
    }
  };

  expect(selectors.getSocketIoVendor(talkConfig(state)))
    .toEqual({ blah: 'blah' });
});

test('getLibPhoneNumberVendor returns the libphonenumber vendor', () => {
  const state = {
    vendor: {
      libphonenumber: {
        blah: 'blah'
      }
    }
  };

  expect(selectors.getLibPhoneNumberVendor(talkConfig(state)))
    .toEqual({ blah: 'blah' });
});

test.each([[PHONE_ONLY, false], [CALLBACK_ONLY, true], [CALLBACK_AND_PHONE, true]])(
  'isCallbackEnabled(%s)',
  (capability, expected) => {
    expect(selectors.isCallbackEnabled(embeddableConfig({ capability })))
      .toEqual(expected);
  },
);
