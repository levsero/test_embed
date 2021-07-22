import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types'
import reducer from '../search'

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
  expect(initialState()).toEqual({ labels: [] })
})

describe('when UPDATE_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      webWidget: {
        answerBot: {
          search: {
            labels: ['hello', 'world'],
          },
        },
      },
    }

    expect(reduce(payload)).toEqual({ labels: ['hello', 'world'] })
  })

  it('returns the default when a different payload is dispatched', () => {
    expect(reduce({})).toEqual({ labels: [] })
  })

  it('returns the current state when other actions are dispatched', () => {
    expect(reducer({ labels: ['hello'] }, { type: 'something else' })).toEqual({
      labels: ['hello'],
    })
  })
})
