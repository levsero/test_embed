import { updateAccountSettings } from 'src/redux/modules/chat';

const onChatConnected = (prevState, nextState, dispatch) => {
  if (prevState.chat.connection === 'connecting' && nextState.chat.connection !== 'connecting') {
    dispatch(updateAccountSettings());
  }
};

export default function onStateChange(prevState, nextState, _, dispatch) {
  onChatConnected(prevState, nextState, dispatch);
}
