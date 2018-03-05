import { getAccountSettings,
         newAgentMessageReceived,
         agentEndChat } from 'src/redux/modules/chat';
import { audio } from 'service/audio';
import { mediator } from 'service/mediator';
import { getChatMessagesByAgent,
         getConnection,
         getUserSoundSettings } from 'src/redux/modules/chat/chat-selectors';
import { getArticleDisplayed } from 'src/redux/modules/helpCenter/helpCenter-selectors';
import { getActiveEmbed,
         getWidgetShown } from 'src/redux/modules/base/base-selectors';

const handleNotificationCounter = (nextState, dispatch) => {
  const activeEmbed = getActiveEmbed(nextState);
  const widgetShown = getWidgetShown(nextState);

  if (!widgetShown || (widgetShown && activeEmbed !== 'chat')) {
    dispatch(newAgentMessageReceived());
    mediator.channel.broadcast('newChat.newMessage');
  }
};

const onChatConnected = (prevState, nextState, dispatch) => {
  if (getConnection(prevState) === 'connecting' && getConnection(nextState) !== 'connecting') {
    dispatch(getAccountSettings());

    mediator.channel.broadcast('newChat.connected');
  }
};

const onNewChatMessage = (prevState, nextState, dispatch) => {
  const prevChats = getChatMessagesByAgent(prevState);
  const nextChats = getChatMessagesByAgent(nextState);
  const isIncomingChat = prevChats.length < nextChats.length;

  if (isIncomingChat) {
    if (getUserSoundSettings(nextState)) {
      audio.play('incoming_message');
    }

    handleNotificationCounter(nextState, dispatch);
  }
};

const onArticleDisplayed = (prevState, nextState) => {
  const prevDisplay = getArticleDisplayed(prevState);
  const nextDisplay = getArticleDisplayed(nextState);

  if (!prevDisplay && nextDisplay) {
    mediator.channel.broadcast('.hide', true);
    mediator.channel.broadcast('ipm.webWidget.show');
  }
};

const onChatEndedByAgent = (prevState, nextState, dispatch) => {
  const prevAgentHasLeft = prevState.chat.agentHasLeft;
  const nextAgentHasLeft = nextState.chat.agentHasLeft;

  if(!prevAgentHasLeft && nextAgentHasLeft) {
    dispatch(agentEndChat());
  }
}

export default function onStateChange(prevState, nextState, _, dispatch) {
  onChatConnected(prevState, nextState, dispatch);
  onNewChatMessage(prevState, nextState, dispatch);
  onArticleDisplayed(prevState, nextState, dispatch);
  onChatEndedByAgent(prevState, nextState, dispatch);
}
