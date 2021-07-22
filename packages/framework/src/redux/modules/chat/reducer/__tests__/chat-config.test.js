import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import config from '../chat-config'

const initialState = {
  defaultToChatWidgetLite: false,
}
const embeddableConfigPayload = {
  embeds: {
    chat: {
      props: {
        defaultToChatWidgetLite: true,
      },
    },
  },
}

testReducer(config, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: embeddableConfigPayload },
    expected: {
      defaultToChatWidgetLite: true,
    },
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: {} },
    expected: initialState,
  },
])
