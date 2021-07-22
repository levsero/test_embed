import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types'
import reducer from '../chat-connectionSuppress'

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
  expect(initialState()).toEqual(false)
})

describe('when UPDATE_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      webWidget: {
        chat: {
          connectionSuppress: true,
        },
      },
    }

    expect(reduce(payload)).toEqual(true)
  })
})
