import { combineReducers } from 'redux';

import lastScroll from './last-scroll';
import lastScreenClosed from './last-screen-closed';

export default combineReducers({
  lastScroll,
  lastScreenClosed
});
