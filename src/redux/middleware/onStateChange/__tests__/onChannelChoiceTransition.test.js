import onChannelChoiceTransition from '../onChannelChoiceTransition'
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types'
import { mediator } from 'service/mediator'
import { chat } from 'embed/chat/chat'

jest.mock('src/redux/modules/talk')
jest.mock('service/mediator')
jest.mock('embed/chat/chat')

const activeEmbed = activeEmbed => {
  return {
    base: {
      activeEmbed
    }
  }
}
const action = { type: UPDATE_ACTIVE_EMBED }
const dispatch = jest.fn()

test('broadcasts mediator when answer bot -> zopimChat', () => {
  onChannelChoiceTransition(activeEmbed('answerBot'), activeEmbed('zopimChat'), action, dispatch)
  expect(mediator.channel.broadcast).toHaveBeenCalledWith('webWidget.hide')
})

test('calls chat.show when answer bot -> zopimChat', () => {
  onChannelChoiceTransition(activeEmbed('answerBot'), activeEmbed('zopimChat'), action, dispatch)
  expect(chat.show).toHaveBeenCalled()
})

test('does not dispatch anything when action is not UPDATE_ACTIVE_EMBED', () => {
  onChannelChoiceTransition(
    activeEmbed('talk'),
    activeEmbed('helpCenterForm'),
    { type: 'something else' },
    dispatch
  )
  expect(dispatch).not.toHaveBeenCalled()
})

test('does not dispatch anything when previous embed is not answer bot', () => {
  onChannelChoiceTransition(activeEmbed('helpCenterForm'), activeEmbed('talk'), action, dispatch)
  expect(dispatch).not.toHaveBeenCalled()
})
