import { updateAccountSettings,
         incrementNotificationCount } from 'src/redux/modules/chat';
import { audio } from 'service/audio';
import { getChatsByAgent,
         getConnection,
         getUserSoundSettings,
         getNotification } from 'src/redux/modules/chat/chat-selectors';
import { getActiveEmbed,
         getEmbedShown } from 'src/redux/modules/base/base-selectors';

const handleNotificationCounter = (nextState, dispatch) => {
  const activeEmbed = getActiveEmbed(nextState);
  const embedShown = getEmbedShown(nextState);

  if (!embedShown || (embedShown && activeEmbed !== 'chat')) {
    dispatch(incrementNotificationCount());
  }
}

const onChatConnected = (prevState, nextState, dispatch) => {
  if (getConnection(prevState) === 'connecting' && getConnection(nextState) !== 'connecting') {
    dispatch(updateAccountSettings());
  }
};

const onNewChatMessage = (prevState, nextState, dispatch) => {
  const prevChats = getChatsByAgent(prevState);
  const nextChats = getChatsByAgent(nextState);
  const isIncomingChat = prevChats.length < nextChats.length;

  if (isIncomingChat) {
    if (getUserSoundSettings(nextState)) {
      audio.play('incoming_message');
    }

    handleNotificationCounter(nextState, dispatch);
  }
};

export default function onStateChange(prevState, nextState, _, dispatch) {
  onChatConnected(prevState, nextState, dispatch);
  onNewChatMessage(prevState, nextState, dispatch);
}
