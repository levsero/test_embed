import { UPDATE_PREVIEWER_SCREEN, UPDATE_PREVIEWER_SETTINGS } from 'src/redux/modules/chat/chat-action-types';

const allowedActions = [
  UPDATE_PREVIEWER_SETTINGS,
  UPDATE_PREVIEWER_SCREEN
];

export default function throttle(block) {
  return () => (next) => (action) => {
    if (!block || allowedActions.includes(action.type) || action.type.indexOf('websdk/') === 0) {
      return next(action);
    }
  };
}
