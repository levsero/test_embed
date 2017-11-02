import { updateAccountSettings } from 'src/redux/modules/chat';
import { audio } from 'service/audio';
import { getUserSoundSettings } from 'src/redux/modules/chat/selectors';

const onChatConnected = (prevState, nextState, dispatch) => {
  if (prevState.chat.connection === 'connecting' && nextState.chat.connection !== 'connecting') {
    dispatch(updateAccountSettings());
  }
};

const onNewChatMessage = (prevState, nextState) => {
  if (!getUserSoundSettings(nextState)) return;

  const prevSize = prevState.chat.chats.size;
  const nextSize = nextState.chat.chats.size;

  if (prevSize < nextSize) {
    const nextChatMsg = nextState.chat.chats.get([...nextState.chat.chats.keys()][nextState.chat.chats.size - 1]);

    if (nextChatMsg.type === 'chat.msg' && nextChatMsg.nick.indexOf('agent') > -1) {
      audio.play('incoming_message');
    }
  }
};

export default function onStateChange(prevState, nextState, _, dispatch) {
  onChatConnected(prevState, nextState, dispatch);
  onNewChatMessage(prevState, nextState, dispatch);
}
