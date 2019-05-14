import * as callbacks from '../callbacks';
import { API_ON_OPEN_NAME, API_ON_CLOSE_NAME } from 'constants/api';

test('invalid event name', () => {
  const callbackSpy = jest.fn();

  callbacks.registerCallback(callbackSpy, API_ON_OPEN_NAME);
  callbacks.fireWidgetEvent('yolo');

  expect(callbackSpy)
    .not
    .toHaveBeenCalled();
});

describe('valid event', () => {
  test('callbacks registered', () => {
    const callbackSpyOne = jest.fn();
    const callbackSpyTwo = jest.fn();

    callbacks.registerCallback(callbackSpyOne, API_ON_OPEN_NAME);
    callbacks.registerCallback(callbackSpyTwo, API_ON_OPEN_NAME);
    callbacks.fireWidgetEvent(API_ON_OPEN_NAME);

    expect(callbackSpyOne)
      .toHaveBeenCalled();
    expect(callbackSpyTwo)
      .toHaveBeenCalled();
  });

  test('callback not registered', () => {
    const callbackSpy = jest.fn();

    callbacks.registerCallback(callbackSpy, API_ON_OPEN_NAME);
    callbacks.fireWidgetEvent(API_ON_CLOSE_NAME);

    expect(callbackSpy)
      .not
      .toHaveBeenCalled();
  });

  test('multiple callbacks registered for multiple events', () => {
    const callbackSpys = [jest.fn(), jest.fn(), jest.fn()];

    callbacks.registerCallback(callbackSpys[0], API_ON_OPEN_NAME);
    callbacks.registerCallback(callbackSpys[1], API_ON_OPEN_NAME);
    callbacks.registerCallback(callbackSpys[2], API_ON_CLOSE_NAME);

    callbacks.fireWidgetEvent(API_ON_CLOSE_NAME);
    expect(callbackSpys[0]).not.toHaveBeenCalled();
    expect(callbackSpys[1]).not.toHaveBeenCalled();
    expect(callbackSpys[2]).toHaveBeenCalled();

    callbackSpys.forEach(cb => cb.mockClear());

    callbacks.fireWidgetEvent(API_ON_OPEN_NAME);
    expect(callbackSpys[0]).toHaveBeenCalled();
    expect(callbackSpys[1]).toHaveBeenCalled();
    expect(callbackSpys[2]).not.toHaveBeenCalled();
  });
});
