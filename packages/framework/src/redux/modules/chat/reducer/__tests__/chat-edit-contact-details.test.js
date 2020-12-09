import editContactDetails from '../chat-edit-contact-details'
import * as actions from 'src/redux/modules/chat/chat-action-types'
import * as baseActions from 'src/redux/modules/base/base-action-types'
import * as chatConstants from 'constants/chat'

describe('editContactDetails', () => {
  const initialState = editContactDetails(undefined, { type: '' })
  const mockFormState = {
    display_name: 'Bob',
    email: 'bob@bob.com'
  }
  const reduce = (action, state = undefined) => editContactDetails(state, action)

  test('initialState', () => {
    expect(initialState).toEqual({
      status: chatConstants.EDIT_CONTACT_DETAILS_SCREEN,
      show: false,
      display_name: null,
      email: null,
      error: false
    })
  })

  describe('when a SET_VISITOR_INFO_REQUEST_SUCCESS action is dispatched', () => {
    it('sets the screen to the normal screen and sets the action payload as the state', () => {
      expect(
        reduce({
          type: actions.SET_VISITOR_INFO_REQUEST_SUCCESS,
          payload: mockFormState
        })
      ).toEqual({
        ...initialState,
        ...mockFormState,
        status: chatConstants.EDIT_CONTACT_DETAILS_SCREEN
      })
    })
  })

  describe('when a SET_VISITOR_INFO_REQUEST_PENDING action is dispatched', () => {
    it('sets the screen to the loading screen and sets the action payload as the state', () => {
      expect(
        reduce({
          type: actions.SET_VISITOR_INFO_REQUEST_PENDING,
          payload: mockFormState
        })
      ).toEqual({
        ...initialState,
        ...mockFormState,
        status: chatConstants.EDIT_CONTACT_DETAILS_LOADING_SCREEN
      })
    })
  })

  describe('when a SDK_ERROR action is dispatched', () => {
    it('sets the screen to the error screen and sets the show state to false', () => {
      expect(reduce({ type: actions.SDK_ERROR })).toEqual({
        ...initialState,
        status: chatConstants.EDIT_CONTACT_DETAILS_ERROR_SCREEN,
        show: false,
        error: true
      })
    })
  })

  describe('when a UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY action is dispatched', () => {
    it('sets the screen to the normal screen and sets the show state to true', () => {
      expect(
        reduce({
          type: actions.UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
          payload: true
        })
      ).toEqual({
        ...initialState,
        status: chatConstants.EDIT_CONTACT_DETAILS_SCREEN,
        show: true
      })
    })
  })

  describe('when an API_CLEAR_FORM action is dispatched', () => {
    it('resets the form state to initialState', () => {
      expect(reduce({ type: baseActions.API_CLEAR_FORM }, mockFormState)).toEqual(initialState)
    })
  })

  describe('when a PREFILL_RECEIVED action is dispatched', () => {
    describe('with both a name and an email values', () => {
      it('adds the action payload to the state', () => {
        expect(
          reduce({
            type: baseActions.PREFILL_RECEIVED,
            payload: {
              prefillValues: { name: 'Not Terence', email: 'foo@example.com' }
            }
          })
        ).toMatchObject({
          display_name: 'Not Terence',
          email: 'foo@example.com'
        })
      })
    })

    describe('with only a name value', () => {
      it('adds the action payload to the state', () => {
        expect(
          reduce({
            type: baseActions.PREFILL_RECEIVED,
            payload: { prefillValues: { name: 'Not Terence' } }
          })
        ).toMatchObject({
          display_name: 'Not Terence',
          email: null
        })
      })
    })

    describe('with only an email value', () => {
      it('adds the action payload to the state', () => {
        expect(
          reduce({
            type: baseActions.PREFILL_RECEIVED,
            payload: { prefillValues: { email: 'foo@example.com' } }
          })
        ).toMatchObject({
          display_name: null,
          email: 'foo@example.com'
        })
      })
    })
  })

  describe('when a SDK_VISITOR_UPDATE action is dispatched', () => {
    let newFormState = {}

    beforeEach(() => {
      newFormState = {
        display_name: 'Not Terence',
        email: 'foo@baz'
      }
    })

    it('adds the action payload to the state', () => {
      expect(
        reduce({
          type: actions.SDK_VISITOR_UPDATE,
          payload: { detail: newFormState }
        })
      ).toEqual({
        ...initialState,
        ...newFormState
      })
    })

    describe('when a visitor name is passed', () => {
      beforeEach(() => {
        newFormState.display_name = 'Visitor 2131231'
      })

      it('does not update visitor name', () => {
        expect(
          reduce({
            type: actions.SDK_VISITOR_UPDATE,
            payload: { detail: newFormState }
          })
        ).toEqual({
          ...initialState,
          email: 'foo@baz'
        })
      })
    })

    describe('when the payload contains an empty string for the email property', () => {
      beforeEach(() => {
        newFormState = {
          display_name: 'Visitor 2131231',
          email: ''
        }
      })

      it('does not update an existing email value', () => {
        expect(
          reduce(
            {
              type: actions.SDK_VISITOR_UPDATE,
              payload: { detail: newFormState }
            },
            { ...initialState, email: 'prefilled@example.com' }
          )
        ).toEqual({
          ...initialState,
          email: 'prefilled@example.com'
        })
      })
    })
  })
})
