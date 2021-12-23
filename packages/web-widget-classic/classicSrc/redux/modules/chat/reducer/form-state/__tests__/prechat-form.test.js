import * as baseActions from 'classicSrc/redux/modules/base/base-action-types'
import * as actions from 'classicSrc/redux/modules/chat/chat-action-types'
import prechatForm from '../prechat-form'

describe('prechat-form', () => {
  const initialState = prechatForm(undefined, { type: '' })
  const mockFormState = {
    name: 'test name',
    phone: '123456789',
    email: 'foo@bar',
    department: 'Sales',
    message: 'message text',
  }
  const reduce = (action, state = undefined) => prechatForm(state, action)

  test('initialState', () => {
    expect(initialState).toEqual({
      name: '',
      email: '',
      phone: '',
      department: '',
      message: '',
    })
  })

  describe('when a PRE_CHAT_FORM_ON_CHANGE action is dispatched', () => {
    it('sets the action payload as the state', () => {
      expect(
        reduce({
          type: actions.PRE_CHAT_FORM_ON_CHANGE,
          payload: mockFormState,
        })
      ).toEqual(mockFormState)
    })
  })

  describe('when an action of type VISITOR_DEFAULT_DEPARTMENT_SELECTED is dispatched', () => {
    it('sets the action payload as the state', () => {
      expect(
        reduce({
          type: actions.VISITOR_DEFAULT_DEPARTMENT_SELECTED,
          payload: mockFormState,
        })
      ).toEqual(mockFormState)
    })
  })

  describe('when an action of type CHAT_BADGE_MESSAGE_CHANGED is dispatched', () => {
    it('sets the action payload as the state', () => {
      expect(reduce({ type: actions.CHAT_BADGE_MESSAGE_CHANGED, payload: 'yeet' })).toEqual({
        ...initialState,
        message: 'yeet',
      })
    })
  })

  describe('when a PREFILL_RECEIVED action is dispatched', () => {
    const newFormState = {
      email: 'new@email.com',
    }

    it('adds the action payload to the state', () => {
      expect(
        reduce({
          type: baseActions.PREFILL_RECEIVED,
          payload: { prefillValues: newFormState },
        })
      ).toEqual({
        ...initialState,
        ...newFormState,
      })
    })
  })

  describe('when a SDK_VISITOR_UPDATE action is dispatched', () => {
    let newFormState = {}

    beforeEach(() => {
      newFormState = {
        display_name: 'Not Terence',
        email: 'foo@baz',
        phone: '87654321',
      }
    })

    it('adds the action payload to the state', () => {
      expect(
        reduce({
          type: actions.SDK_VISITOR_UPDATE,
          payload: { detail: newFormState },
        })
      ).toEqual({
        ...initialState,
        name: 'Not Terence',
        email: 'foo@baz',
        phone: '87654321',
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
            payload: { detail: newFormState },
          })
        ).toEqual({
          ...initialState,
          email: 'foo@baz',
          phone: '87654321',
        })
      })
    })

    describe('when the payload contains an empty string for the email property', () => {
      beforeEach(() => {
        newFormState = {
          display_name: 'Visitor 2131231',
          email: '',
        }
      })

      it('does not update an existing email value', () => {
        expect(
          reduce(
            {
              type: actions.SDK_VISITOR_UPDATE,
              payload: { detail: newFormState },
            },
            { ...initialState, email: 'prefilled@example.com' }
          )
        ).toEqual({
          ...initialState,
          email: 'prefilled@example.com',
        })
      })
    })
  })

  describe('when a API_CLEAR_FORM action is dispatched', () => {
    it('resets the form state to initialState', () => {
      expect(reduce({ type: baseActions.API_CLEAR_FORM }, mockFormState)).toEqual(initialState)
    })
  })

  describe('when an SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE action is dispatched', () => {
    it('resets the form state to initialState', () => {
      expect(
        reduce({
          type: actions.SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE,
          payload: { detail: { id: 123 } },
        })
      ).toEqual({
        ...initialState,
        department: 123,
      })
    })
  })
})
