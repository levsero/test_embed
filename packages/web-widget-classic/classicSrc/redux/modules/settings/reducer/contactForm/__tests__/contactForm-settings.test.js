import * as settingsActionTypes from 'classicSrc/redux/modules/settings/settings-action-types'
import reducer from '../contactForm-settings'

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
    attachments: true,
    subject: false,
    suppress: false,
    tags: [],
    title: {},
    selectTicketForm: {},
  })
})

describe('when UPDATE_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      webWidget: {
        contactForm: {
          attachments: false,
          subject: true,
          suppress: true,
          tags: ['hello'],
          title: { '*': 'wassup' },
          selectTicketForm: { '*': 'yo select this ticket form' },
        },
      },
    }

    expect(reduce(payload)).toEqual({
      attachments: false,
      subject: true,
      suppress: true,
      tags: ['hello'],
      title: { '*': 'wassup' },
      selectTicketForm: { '*': 'yo select this ticket form' },
    })
  })
})
