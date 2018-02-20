import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore;

const httpGetSpy = jasmine.createSpy('http.send');
const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('submitTicket redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const actionsPath = buildSrcPath('redux/modules/submitTicket');
    const actionTypesPath = buildSrcPath('redux/modules/submitTicket/submitTicket-action-types');

    initMockRegistry({
      'service/transport': {
        http: {
          get: httpGetSpy
        }
      }
    });

    httpGetSpy.calls.reset();

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ submitTicket: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('handleFormChange', () => {
    let action;
    const mockFormState = {
      name: 'Gandalf',
      email: 'abc@123.com'
    };

    beforeEach(() => {
      mockStore.dispatch(actions.handleFormChange(mockFormState));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type FORM_ON_CHANGE', () => {
      expect(action.type)
        .toEqual(actionTypes.FORM_ON_CHANGE);
    });

    it('contains the form state as the payload', () => {
      expect(action.payload)
        .toEqual(mockFormState);
    });
  });

  describe('getTicketForms', () => {
    let action;
    const ticketFormIds = [1, 2, 4];
    const locale = 'fr';

    beforeEach(() => {
      mockStore.dispatch(actions.getTicketForms(ticketFormIds, locale));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type TICKET_FORMS_REQUEST_SENT', () => {
      expect(action.type)
        .toEqual(actionTypes.TICKET_FORMS_REQUEST_SENT);
    });

    it('sends a http get request with the correct params', () => {
      expect(httpGetSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'get',
          path: '/api/v2/ticket_forms/show_many.json?ids=1,2,4&include=ticket_fields',
          locale
        }), false);
    });

    describe('ticket forms response', () => {
      describe('when the request is successful', () => {
        beforeEach(() => {
          const searchRequest = httpGetSpy.calls.mostRecent().args;
          const callbackFn = searchRequest[0].callbacks.done;

          callbackFn({ text: `{"ticket_forms":[{"id":123}],"count":7}` });
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type TICKET_FORMS_REQUEST_SUCCESS', () => {
          expect(action.type)
            .toEqual(actionTypes.TICKET_FORMS_REQUEST_SUCCESS);
        });

        it('dispatches an action with a payload of the parsed text response', () => {
          expect(action.payload)
            .toEqual({ ticket_forms: [ { id: 123 } ], count: 7 }); // eslint-disable-line camelcase
        });
      });

      describe('when the request is unsuccessful', () => {
        beforeEach(() => {
          const searchRequest = httpGetSpy.calls.mostRecent().args;
          const callbackFn = searchRequest[0].callbacks.fail;

          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type TICKET_FORMS_REQUEST_FAILURE', () => {
          expect(action.type)
            .toEqual(actionTypes.TICKET_FORMS_REQUEST_FAILURE);
        });
      });
    });
  });

  describe('getTicketFields', () => {
    let action;
    const ticketFieldIds = { ids: [2, 3, 5] };
    const locale = 'de';

    beforeEach(() => {
      mockStore.dispatch(actions.getTicketFields(ticketFieldIds, locale));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type TICKET_FIELDS_REQUEST_SENT', () => {
      expect(action.type)
        .toEqual(actionTypes.TICKET_FIELDS_REQUEST_SENT);
    });

    it('sends a http get request with the correct params', () => {
      expect(httpGetSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'get',
          path: '/embeddable/ticket_fields?field_ids=2,3,5&locale=de'
        }), false);
    });

    describe('when a all param is used', () => {
      beforeEach(() => {
        mockStore.dispatch(actions.getTicketFields({ all: true }, locale));
        action = mockStore.getActions()[0];
      });

      it('sends a with a different query string', () => {
        expect(httpGetSpy)
          .toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/embeddable/ticket_fields?locale=de'
          }), false);
      });
    });

    describe('ticket fields response', () => {
      describe('when the request is successful', () => {
        beforeEach(() => {
          const searchRequest = httpGetSpy.calls.mostRecent().args;
          const callbackFn = searchRequest[0].callbacks.done;

          callbackFn({ text: `{"ticketFields":[{"id":456}],"count":3}` });
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type TICKET_FIELDS_REQUEST_SUCCESS', () => {
          expect(action.type)
            .toEqual(actionTypes.TICKET_FIELDS_REQUEST_SUCCESS);
        });

        it('dispatches an action with a payload of the parsed text response', () => {
          expect(action.payload)
            .toEqual({ ticketFields: [ { id: 456 } ], count: 3 }); // eslint-disable-line camelcase
        });
      });

      describe('when the request is unsuccessful', () => {
        beforeEach(() => {
          const searchRequest = httpGetSpy.calls.mostRecent().args;
          const callbackFn = searchRequest[0].callbacks.fail;

          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type TICKET_FIELDS_REQUEST_FAILURE', () => {
          expect(action.type)
            .toEqual(actionTypes.TICKET_FIELDS_REQUEST_FAILURE);
        });
      });
    });
  });

  describe('handleTicketFormClick', () => {
    let action,
      form;

    beforeEach(() => {
      form = { id: 1 };
      mockStore.dispatch(actions.handleTicketFormClick(form));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type TICKET_FORM_UPDATE ', () => {
      expect(action.type)
        .toEqual(actionTypes.TICKET_FORM_UPDATE);
    });

    it('has the form in the payload', () => {
      expect(action.payload)
        .toBe(form);
    });
  });
});
