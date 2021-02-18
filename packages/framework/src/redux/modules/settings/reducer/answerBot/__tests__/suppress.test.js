import reducer from '../suppress'
import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types'

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
        answerBot: {
          suppress: true,
        },
      },
    }

    expect(reduce(payload)).toEqual(true)
  })
})
