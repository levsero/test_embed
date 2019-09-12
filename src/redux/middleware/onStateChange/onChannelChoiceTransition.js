import { mediator } from 'service/mediator'
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors'
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types'
import { chat as zopimChat } from 'embed/chat/chat'

export default function onChannelChoiceTransition(prevState, nextState, action) {
  if (action && action.type === UPDATE_ACTIVE_EMBED) {
    const prevEmbed = getActiveEmbed(prevState)
    const nextEmbed = getActiveEmbed(nextState)

    if (prevEmbed === 'answerBot') {
      switch (nextEmbed) {
        case 'zopimChat':
          zopimChat.show('zopimChat')
          mediator.channel.broadcast('webWidget.hide')
          return
      }
    }
  }
}
