import * as actions from '../talk-actions';
import * as types from '../talk-action-types';

describe('talk actions', () => {
  it('creates an action to update agent availability', () => {
    const expected = {
      type: types.UPDATE_TALK_AGENT_AVAILABILITY,
      payload: true
    };

    expect(actions.updateTalkAgentAvailability(true))
      .toEqual(expected);
  });
});
