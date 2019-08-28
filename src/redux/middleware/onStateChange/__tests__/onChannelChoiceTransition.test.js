import onChannelChoiceTransition from '../onChannelChoiceTransition'
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types'
import { mediator } from 'service/mediator'

jest.mock('src/redux/modules/talk')
jest.mock('service/mediator')

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
  expect(mediator.channel.broadcast).toHaveBeenNthCalledWith(1, 'helpCenterForm.onNextClick')
  expect(mediator.channel.broadcast).toHaveBeenNthCalledWith(2, 'webWidget.hide')
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
