import { getWidgetShown, getActiveEmbed } from 'classicSrc/redux/modules/base/base-selectors'
import { chatOpened } from 'classicSrc/redux/modules/chat'

export default function onChatOpen(prevState, nextState, dispatch) {
  const widgetShown = getWidgetShown(prevState)

  if (widgetShown && getActiveEmbed(prevState) !== 'chat' && getActiveEmbed(nextState) === 'chat') {
    dispatch(chatOpened())
  }
}
