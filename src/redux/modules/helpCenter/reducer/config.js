import { UPDATE_EMBEDDABLE_CONFIG } from '../../base/base-action-types'

import _ from 'lodash'

const initialState = {
  contextualHelpEnabled: false,
  signInRequired: false,
  answerBotEnabled: false,
  buttonLabelKey: 'message',
  formTitleKey: 'help'
}

const config = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_EMBEDDABLE_CONFIG:
      return {
        ...state,
        ..._.get(payload, 'embeds.helpCenterForm.props', {})
      }
    default:
      return state
  }
}

export default config
