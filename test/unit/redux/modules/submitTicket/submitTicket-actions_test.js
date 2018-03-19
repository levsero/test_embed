import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore;

const httpGetSpy = jasmine.createSpy('http.get');
const httpSendSpy = jasmine.createSpy('http.send');
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
          get: httpGetSpy,
          send: httpSendSpy
        }
      },
      'src/redux/modules/submitTicket/submitTicket-selectors': {
        getTicketFormsAvailable: noop,
        getTicketFields: noop,
        getActiveTicketForm: noop,
        getFormState: noop
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      './helpers/formatter': {
        formatRequestData: () => 'mockTicketSubmissionParams'
      }
    });

    httpGetSpy.calls.reset();
    httpSendSpy.calls.reset();

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
          path: '/api/v2/ticket_forms/show_many.json?ids=1,2,4&include=ticket_fields&locale=fr',
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

  describe('handleTicketSubmission', () => {
    let action;
    const attachments = [2, 3, 5];
    const doneFn = jasmine.createSpy('done');
    const failFn = jasmine.createSpy('fail');

    beforeEach(() => {
      mockStore.dispatch(actions.handleTicketSubmission(attachments, doneFn, failFn));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type TICKET_SUBMISSION_REQUEST_SENT', () => {
      expect(action.type)
        .toEqual(actionTypes.TICKET_SUBMISSION_REQUEST_SENT);
    });

    it('sends a http get request with correct params', () => {
      expect(httpSendSpy)
        .toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'post',
          path: '/api/v2/requests',
          params: 'mockTicketSubmissionParams',
          callbacks: jasmine.any(Object)
        }));
    });

    describe('requests response', () => {
      describe('when the request is successful', () => {
        beforeEach(() => {
          const request = httpSendSpy.calls.mostRecent().args;
          const callbackFn = request[0].callbacks.done;

          callbackFn({ text: `{"request":"success"}` });
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type TICKET_SUBMISSION_REQUEST_SUCCESS', () => {
          expect(action.type)
            .toEqual(actionTypes.TICKET_SUBMISSION_REQUEST_SUCCESS);
        });

        it('dispatches an action with a payload of the parsed text response', () => {
          expect(action.payload)
            .toEqual({ 'request': 'success' });
        });

        it('calls the done function param', () => {
          expect(doneFn)
            .toHaveBeenCalled();
        });
      });

      describe('when the request is unsuccessful', () => {
        let callbackFn;

        beforeEach(() => {
          const request = httpSendSpy.calls.mostRecent().args;

          callbackFn = request[0].callbacks.fail;

          callbackFn({});
          action = mockStore.getActions()[1];
        });

        it('dispatches an action of type TICKET_SUBMISSION_REQUEST_FAILURE', () => {
          expect(action.type)
            .toEqual(actionTypes.TICKET_SUBMISSION_REQUEST_FAILURE);
        });

        it('dispatches an action with a payload of the generic error message', () => {
          expect(action.payload)
            .toEqual('embeddable_framework.submitTicket.notify.message.error');
        });

        describe('when the error is a timeout error', () => {
          beforeEach(() => {
            callbackFn({ timeout: true });
            action = mockStore.getActions()[2];
          });

          it('dispatches an action with a payload of the timeout error message', () => {
            expect(action.payload)
              .toEqual('embeddable_framework.submitTicket.notify.message.timeout');
          });
        });

        it('calls the fail function param', () => {
          expect(failFn)
            .toHaveBeenCalled();
        });
      });
    });
  });
});
