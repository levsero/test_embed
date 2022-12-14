import * as settingsActionTypes from 'classicSrc/redux/modules/settings/settings-action-types'
import reducer from '../index'

const initialState = () => {
  return reducer(undefined, { type: '' })
}

const reduce = (payload) => {
  return reducer(initialState(), {
    type: settingsActionTypes.UPDATE_SETTINGS,
    payload: payload,
  })
}

test('initial state', () => {
  expect(initialState()).toEqual({ popoutButton: { enabled: true } })
})

describe('when UPDATE_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      webWidget: {
        navigation: {
          popoutButton: {
            enabled: false,
          },
        },
      },
    }

    expect(reduce(payload)).toEqual({ popoutButton: { enabled: false } })
  })
})
