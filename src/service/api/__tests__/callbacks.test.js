import * as callbacks from '../callbacks';
import {
  WIDGET_OPENED_EVENT,
  WIDGET_CLOSED_EVENT,
  CHAT_CONNECTED_EVENT,
  CHAT_DEPARTMENT_STATUS_EVENT
} from 'constants/event';

test('invalid event name', () => {
  const callbackSpy = jest.fn();

  callbacks.registerCallback(callbackSpy, WIDGET_OPENED_EVENT);
  callbacks.fireFor('yolo');

  expect(callbackSpy)
    .not
    .toHaveBeenCalled();
});

describe('valid event', () => {
  test('callbacks registered', () => {
    const callbackSpyOne = jest.fn();
    const callbackSpyTwo = jest.fn();

    callbacks.registerCallback(callbackSpyOne, WIDGET_OPENED_EVENT);
    callbacks.registerCallback(callbackSpyTwo, WIDGET_OPENED_EVENT);
    callbacks.fireFor(WIDGET_OPENED_EVENT);

    expect(callbackSpyOne)
      .toHaveBeenCalled();
    expect(callbackSpyTwo)
      .toHaveBeenCalled();
  });

  test('callback not registered', () => {
    const callbackSpy = jest.fn();

    callbacks.registerCallback(callbackSpy, WIDGET_OPENED_EVENT);
    callbacks.fireFor(WIDGET_CLOSED_EVENT);

    expect(callbackSpy)
      .not
      .toHaveBeenCalled();
  });

  test('multiple callbacks registered for multiple events', () => {
    const callbackSpys = [jest.fn(), jest.fn(), jest.fn(), jest.fn()];

    callbacks.registerCallback(callbackSpys[0], WIDGET_OPENED_EVENT);
    callbacks.registerCallback(callbackSpys[1], WIDGET_OPENED_EVENT);
    callbacks.registerCallback(callbackSpys[2], WIDGET_CLOSED_EVENT);
    callbacks.registerCallback(callbackSpys[3], CHAT_CONNECTED_EVENT);

    callbacks.fireEventsFor(WIDGET_CLOSED_EVENT);
    expect(callbackSpys[0]).not.toHaveBeenCalled();
    expect(callbackSpys[1]).not.toHaveBeenCalled();
    expect(callbackSpys[2]).toHaveBeenCalled();
    expect(callbackSpys[3]).not.toHaveBeenCalled();

    callbackSpys.forEach(cb => cb.mockClear());

    callbacks.fireEventsFor(WIDGET_OPENED_EVENT);
    expect(callbackSpys[0]).toHaveBeenCalled();
    expect(callbackSpys[1]).toHaveBeenCalled();
    expect(callbackSpys[2]).not.toHaveBeenCalled();
    expect(callbackSpys[3]).not.toHaveBeenCalled();

    callbackSpys.forEach(cb => cb.mockClear());

    callbacks.fireEventsFor(CHAT_CONNECTED_EVENT);
    expect(callbackSpys[0]).not.toHaveBeenCalled();
    expect(callbackSpys[1]).not.toHaveBeenCalled();
    expect(callbackSpys[2]).not.toHaveBeenCalled();
    expect(callbackSpys[3]).toHaveBeenCalled();
  });

  test('fireFor with arguments', () => {
    const callbackSpy = jest.fn();

    callbacks.registerCallback(callbackSpy, CHAT_DEPARTMENT_STATUS_EVENT);
    callbacks.fireFor(CHAT_DEPARTMENT_STATUS_EVENT, ['yeet', 10]);

    expect(callbackSpy).toHaveBeenCalledWith('yeet', 10);
  });
});
