import 'utility/i18nTestHelper';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../submitTicket-actions';
import * as types from '../submitTicket-action-types';
import { http } from 'service/transport';
import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors';
import * as formatters from '../helpers/formatter';

jest.mock('service/transport');
jest.mock('src/redux/modules/submitTicket/submitTicket-selectors');
jest.mock('../helpers/formatter');

const mockStore = configureMockStore([thunk]);

test('handleFormChange dispatches expected action', () => {
  const expected = {
    type: types.FORM_ON_CHANGE,
    payload: { a: true }
  };

  expect(actions.handleFormChange({ a: true }))
    .toEqual(expected);
});

test('handleTicketFormClick dispatches expected action', () => {
  const expected = {
    type: types.TICKET_FORM_UPDATE,
    payload: { a: true }
  };

  expect(actions.handleTicketFormClick({ a: true }))
    .toEqual(expected);
});

describe('getTicketForms', () => {
  const dispatchAction = (customFields, locale) => {
    const store = mockStore({});

    store.dispatch(actions.getTicketForms(customFields, locale));
    return store;
  };

  it('dispatches the expected action', () => {
    const store = dispatchAction();

    expect(store.getActions())
      .toEqual([{
        type: types.TICKET_FORMS_REQUEST_SENT
      }]);
  });

  it('sends the expected request payload', () => {
    dispatchAction('123', 'ru');

    expect(http.get)
      .toHaveBeenCalledWith({
        callbacks: { done: expect.any(Function), fail: expect.any(Function) },
        locale: 'ru',
        method: 'get',
        path: '/api/v2/ticket_forms/show_many.json?ids=123&include=ticket_fields&locale=ru',
        timeout: 20000
      }, false);
  });

  const doCallback = (callbackType, args) => {
    const store = dispatchAction();
    const callback = http.get.mock.calls[0][0].callbacks[callbackType];

    callback(args);
    const actions = store.getActions();

    actions.shift();
    return actions;
  };

  it('dispatches expected actions on failed request', () => {
    expect(doCallback('fail'))
      .toEqual([
        {
          type: types.TICKET_FORMS_REQUEST_FAILURE
        }
      ]);
  });

  it('dispatches expected actions on successful request with a single form payload', () => {
    const payload = {
      ticket_forms: ['a'] // eslint-disable-line camelcase
    };

    expect(doCallback('done', { text: JSON.stringify(payload) }))
      .toEqual([
        {
          type: types.TICKET_FORMS_REQUEST_SUCCESS,
          payload
        },
        {
          type: types.TICKET_FORM_UPDATE,
          payload: 'a'
        }
      ]);
  });

  it('dispatches expected actions on successful request with a no forms payload', () => {
    const payload = {
      ticket_forms: [] // eslint-disable-line camelcase
    };

    expect(doCallback('done', { text: JSON.stringify(payload) }))
      .toEqual([
        {
          type: types.TICKET_FORMS_REQUEST_SUCCESS,
          payload
        }
      ]);
  });

  it('dispatches expected actions on successful request with multiple forms payload', () => {
    const payload = {
      ticket_forms: ['a', 'b'] // eslint-disable-line camelcase
    };

    expect(doCallback('done', { text: JSON.stringify(payload) }))
      .toEqual([
        {
          type: types.TICKET_FORMS_REQUEST_SUCCESS,
          payload
        }
      ]);
  });
});

describe('getTicketFields', () => {
  const dispatchAction = (customFields, locale) => {
    const store = mockStore({});

    store.dispatch(actions.getTicketFields(customFields, locale));
    return store;
  };

  it('dispatches the expected action', () => {
    const store = dispatchAction({ ids: '123' }, 'ru');

    expect(store.getActions())
      .toEqual([{
        type: types.TICKET_FIELDS_REQUEST_SENT
      }]);
  });

  it('sends the expected request payload for ids', () => {
    dispatchAction({ ids: '123' }, 'ru');

    expect(http.get)
      .toHaveBeenCalledWith({
        callbacks: { done: expect.any(Function), fail: expect.any(Function) },
        locale: 'ru',
        method: 'get',
        path: '/embeddable/ticket_fields?field_ids=123&locale=ru',
        timeout: 20000
      }, false);
  });

  it('sends the expected request payload for all', () => {
    dispatchAction({ all: true, ids: '123' }, 'th');

    expect(http.get)
      .toHaveBeenCalledWith({
        callbacks: { done: expect.any(Function), fail: expect.any(Function) },
        locale: 'th',
        method: 'get',
        path: '/embeddable/ticket_fields?locale=th',
        timeout: 20000
      }, false);
  });

  const doCallback = (callbackType, args) => {
    const store = dispatchAction({});
    const callback = http.get.mock.calls[0][0].callbacks[callbackType];

    callback(args);
    const actions = store.getActions();

    actions.shift();
    return actions;
  };

  it('dispatches expected actions on failed request', () => {
    expect(doCallback('fail'))
      .toEqual([
        {
          type: types.TICKET_FIELDS_REQUEST_FAILURE
        }
      ]);
  });

  it('dispatches expected actions on successful request', () => {
    expect(doCallback('done', { text: JSON.stringify({ abc: true }) }))
      .toEqual([
        {
          type: types.TICKET_FIELDS_REQUEST_SUCCESS,
          payload: { abc: true }
        }
      ]);
  });
});

describe('handleTicketSubmission', () => {
  beforeEach(() => {
    selectors.getFormState = jest.fn(() => 'formState');
    selectors.getTicketFormsAvailable = jest.fn(() => 'ticketFormsAvailable');
    selectors.getTicketFields = jest.fn(() => 'ticketFields');
    selectors.getActiveTicketForm = jest.fn(() => 'activeTicketForm');
    formatters.formatRequestData.mockReturnValue('params');
  });

  it('sends the expected request and action', () => {
    const store = mockStore({}),
      done = jest.fn(),
      fail = jest.fn();

    store.dispatch(actions.handleTicketSubmission([1, 2, 3], done, fail));
    expect(formatters.formatRequestData)
      .toHaveBeenCalledWith(
        'formState',
        'ticketFormsAvailable',
        'ticketFields',
        'activeTicketForm',
        [1, 2, 3]
      );
    expect(http.send)
      .toHaveBeenCalledWith({
        callbacks: { done: expect.any(Function), fail: expect.any(Function) },
        method: 'post',
        params: 'params',
        path: '/api/v2/requests'
      });
    expect(store.getActions())
      .toEqual([
        { type: types.TICKET_SUBMISSION_REQUEST_SENT }
      ]);
  });

  it('dispatches expected actions on successful request', () => {
    const store = mockStore({}),
      done = jest.fn(),
      fail = jest.fn();

    store.dispatch(actions.handleTicketSubmission([1, 2, 3], done, fail));

    const cb = http.send.mock.calls[0][0].callbacks.done;

    cb({ text: JSON.stringify({ a: 123 }) });
    const dispatchedActions = store.getActions();

    dispatchedActions.shift();
    expect(dispatchedActions)
      .toEqual([{
        type: types.TICKET_SUBMISSION_REQUEST_SUCCESS,
        payload: { a: 123 }
      }]);
    expect(done)
      .toHaveBeenCalledWith({ text: JSON.stringify({ a: 123 }) });
  });

  it('dispatches expected actions on failed timeout request', () => {
    const store = mockStore({}),
      done = jest.fn(),
      fail = jest.fn();

    store.dispatch(actions.handleTicketSubmission([1, 2, 3], done, fail));

    const cb = http.send.mock.calls[0][0].callbacks.fail;

    cb({ timeout: true });
    const dispatchedActions = store.getActions();

    dispatchedActions.shift();
    expect(dispatchedActions)
      .toEqual([{
        type: types.TICKET_SUBMISSION_REQUEST_FAILURE,
        payload: 'There was a problem. Please try again.'
      }]);
    expect(fail)
      .toHaveBeenCalledWith({ timeout: true });
  });

  it('dispatches expected actions on failed error request', () => {
    const store = mockStore({}),
      done = jest.fn(),
      fail = jest.fn();

    store.dispatch(actions.handleTicketSubmission([1, 2, 3], done, fail));

    const cb = http.send.mock.calls[0][0].callbacks.fail;

    cb({ something: 'else' });
    const dispatchedActions = store.getActions();

    dispatchedActions.shift();
    expect(dispatchedActions)
      .toEqual([{
        type: types.TICKET_SUBMISSION_REQUEST_FAILURE,
        payload: 'There was an error processing your request. Please try again later.'
      }]);
    expect(fail)
      .toHaveBeenCalledWith({ something: 'else' });
  });
});
