import { getAccountSettings,
         newAgentMessageReceived } from 'src/redux/modules/chat';
import { audio } from 'service/audio';
import { getFilteredChatsByAgent,
         getConnection,
         getUserSoundSettings } from 'src/redux/modules/chat/chat-selectors';
import { getActiveEmbed,
         getWidgetShown } from 'src/redux/modules/base/base-selectors';

const handleNotificationCounter = (nextState, dispatch) => {
  const activeEmbed = getActiveEmbed(nextState);
  const widgetShown = getWidgetShown(nextState);

  if (!widgetShown || (widgetShown && activeEmbed !== 'chat')) {
    dispatch(newAgentMessageReceived());
  }
};

const onChatConnected = (prevState, nextState, dispatch) => {
  if (getConnection(prevState) === 'connecting' && getConnection(nextState) !== 'connecting') {
    dispatch(getAccountSettings());
  }
};

const onNewChatMessage = (prevState, nextState, dispatch) => {
  const prevChats = getFilteredChatsByAgent(prevState);
  const nextChats = getFilteredChatsByAgent(nextState);
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
