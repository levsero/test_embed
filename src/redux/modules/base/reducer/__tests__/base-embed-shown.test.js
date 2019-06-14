import embedShown from '../base-embed-shown';
import { UPDATE_WIDGET_SHOWN, API_RESET_WIDGET, WIDGET_INITIALISED } from '../../base-action-types';
import * as globals from 'utility/globals';
import { testReducer } from 'src/util/testHelpers';

testReducer(embedShown, [
  {
    action: { type: undefined },
    expected: false
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true
  },
  {
    action: { type: API_RESET_WIDGET },
    expected: false
  },
  {
    action: { type: UPDATE_WIDGET_SHOWN, payload: false },
    initialState: true,
    expected: false
  }
]);

describe('WIDGET_INITIALISED', () => {
  it('returns false if not popout', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(false);
    expect(embedShown(undefined, { type: WIDGET_INITIALISED })).toEqual(false);
  });

  it('returns true if popout', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(true);
    expect(embedShown(undefined, { type: WIDGET_INITIALISED })).toEqual(true);
  });
});
