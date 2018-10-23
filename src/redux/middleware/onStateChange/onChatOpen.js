import {
  getWidgetShown,
  getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { chatOpened } from 'src/redux/modules/chat';

export default function onChatOpen(prevState, nextState, dispatch) {
  const widgetShown = getWidgetShown(prevState);

  if (widgetShown && getActiveEmbed(prevState) !== 'chat' && getActiveEmbed(nextState) === 'chat') {
    dispatch(chatOpened());
  }
}
