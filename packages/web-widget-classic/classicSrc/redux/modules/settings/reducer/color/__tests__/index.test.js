import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import reducer from '../index'

describe('settings reducer', () => {
  const expectedState = (updatedState) => ({
    launcher: '',
    launcherText: '',
    theme: null,
    button: '',
    resultLists: '',
    header: '',
    articleLinks: '',
    ...updatedState,
  })

  const payload = (settings) => ({
    webWidget: {
      color: {
        ...settings,
      },
    },
  })

  const happyPathSettings = {
    launcher: '#112255',
    launcherText: '#aabbee',
    theme: '#ffffff',
    button: '#555555',
    resultLists: '#22eeff',
    header: '#ff0000',
    articleLinks: '#443356',
  }

  testReducer(reducer, [
    {
      extraDesc: 'default values',
      action: { type: undefined },
      expected: expectedState(),
    },
    {
      extraDesc: 'happy path',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload(happyPathSettings),
      },
      expected: expectedState(happyPathSettings),
    },
    {
      extraDesc: 'numbers allowed, coerced to string with prepended hash',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: 112245 }),
      },
      expected: expectedState({ launcher: '#112245' }),
    },
    {
      extraDesc: 'hex string without "#" allowed, "#" added',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: 'ff45ee' }),
      },
      expected: expectedState({ launcher: '#ff45ee' }),
    },
    {
      extraDesc: 'caps allowed',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: 'FF45EE' }),
      },
      expected: expectedState({ launcher: '#FF45EE' }),
    },
    {
      extraDesc: 'three char hex allowed',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: 'FFF' }),
      },
      expected: expectedState({ launcher: '#FFF' }),
    },
    {
      extraDesc: 'hex string with too many "#", fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: '##ff45ee' }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'invalid hex with "#", fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: '#aaddzz' }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'invalid hex without "#", fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: 'aaddzz' }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'valid hex with < 3 chars, fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: '#EE' }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'valid hex with > 6 chars, fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: '#1233459' }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'valid hex with 3 < chars < 6, fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: '#1337' }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'bad data, fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: true }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'bad data, fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: NaN }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'bad data, fall back to current state',
      action: {
        type: UPDATE_SETTINGS,
        payload: payload({ launcher: { foo: 'bar' } }),
      },
      expected: expectedState(),
    },
    {
      extraDesc: 'wrong action, fall back to current state',
      action: {
        type: 'DERP DERP',
        payload: payload({ launcher: '#112234' }),
      },
      expected: expectedState(),
    },
  ])
})
