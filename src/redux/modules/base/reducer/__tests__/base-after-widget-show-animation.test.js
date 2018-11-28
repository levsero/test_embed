import reducer from '../base-after-widget-show-animation';
import * as actionTypes from 'src/redux/modules/base/base-action-types';

const initialState = () => {
  return reducer(undefined, { type: '' });
};

const reduce = (type, payload, state = initialState()) => {
  return reducer(state, { type, payload });
};

const mockCallback = () => 'hi';

test('initial state', () => {
  expect(initialState())
    .toEqual([]);
});

describe('when ADD_TO_AFTER_SHOW_ANIMATE is dispatched', () => {
  it('adds the payload to the array', () => {
    expect(reduce(actionTypes.ADD_TO_AFTER_SHOW_ANIMATE, mockCallback))
      .toEqual(expect.arrayContaining([ mockCallback ]));
  });

  it('does not override anything already in the array', () => {
    expect(reduce(actionTypes.ADD_TO_AFTER_SHOW_ANIMATE, mockCallback, [ mockCallback ]))
      .toEqual(expect.arrayContaining([ mockCallback, mockCallback ]));
  });
});

describe('when WIDGET_SHOW_ANIMATION_COMPLETE is dispatched', () => {
  it('resets the state to the initial state', () => {
    expect(reduce(actionTypes.WIDGET_SHOW_ANIMATION_COMPLETE, mockCallback, [ () => {} ]))
      .toEqual(initialState());
  });
});
