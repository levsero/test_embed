import _ from 'lodash'
import { UPDATE_SETTINGS } from '../../settings-action-types'

const initialState = {
  popoutButton: {
    enabled: true,
  },
}

const navigation = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        popoutButton: {
          enabled: _.get(
            payload,
            'webWidget.navigation.popoutButton.enabled',
            state.popoutButton.enabled
          ),
        },
      }
    default:
      return state
  }
}

export default navigation
