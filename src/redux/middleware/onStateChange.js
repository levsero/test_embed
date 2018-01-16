import { updateAccountSettings } from 'src/redux/modules/chat';
import { audio } from 'service/audio';
import { getChatsByAgent,
         getConnection,
         getUserSoundSettings } from 'src/redux/modules/chat/chat-selectors';

const onChatConnected = (prevState, nextState, dispatch) => {
  if (getConnection(prevState) === 'connecting' && getConnection(nextState) !== 'connecting') {
    dispatch(updateAccountSettings());
  }
};

const onNewChatMessage = (prevState, nextState) => {
  if (!getUserSoundSettings(nextState)) return;

  const prevChats = getChatsByAgent(prevState);
  const nextChats = getChatsByAgent(nextState);

  if (prevChats.length < nextChats.length) {
    audio.play('incoming_message');
  }
};

export default function onStateChange(prevState, nextState, _, dispatch) {
  onChatConnected(prevState, nextState, dispatch);
  onNewChatMessage(prevState, nextState);
}
