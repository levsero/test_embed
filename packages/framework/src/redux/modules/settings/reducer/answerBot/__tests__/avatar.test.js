import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types'
import reducer from '../avatar'

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
  expect(initialState()).toEqual({
    url: '',
    name: {},
  })
})

describe('when UPDATE_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      webWidget: {
        answerBot: {
          avatar: {
            name: { '*': 'blah' },
            url: 'url',
          },
        },
      },
    }

    expect(reduce(payload)).toEqual({
      name: { '*': 'blah' },
      url: 'url',
    })
  })
})
