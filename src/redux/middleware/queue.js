import { AUTHENTICATION_SUCCESS } from 'src/redux/modules/base/base-action-types';
import { performContextualSearch } from 'src/redux/modules/helpCenter';
import { removeFromQueue } from 'src/redux/modules/base';
import { getQueue } from 'src/redux/modules/base/base-selectors';

const onAuthenticationSuccess = (nextState, action, dispatch) => {
  if (action.type === AUTHENTICATION_SUCCESS) {
    const queue = getQueue(nextState);

    if (queue.performContextualSearch) {
      dispatch(performContextualSearch(...queue.performContextualSearch));
      dispatch(removeFromQueue('performContextualSearch'));
    }
  }
};

export default function queueCalls(prevState, nextState, action, dispatch = () => {}) {
  onAuthenticationSuccess(nextState, action, dispatch);
}
