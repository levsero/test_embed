import config from '../config'
import { UPDATE_EMBEDDABLE_CONFIG } from '../../../base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = {
  contextualHelpEnabled: false,
  signInRequired: false,
  answerBotEnabled: false
}
const embeddableConfigPayload = {
  embeds: {
    helpCenterForm: {
      props: {
        contextualHelpEnabled: true
      }
    }
  }
}

testReducer(config, [
  {
    action: { type: undefined },
    expected: initialState
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: embeddableConfigPayload },
    expected: {
      contextualHelpEnabled: true,
      signInRequired: false,
      answerBotEnabled: false
    }
  },
  {
    action: { type: UPDATE_EMBEDDABLE_CONFIG, payload: {} },
    expected: initialState
  }
])
