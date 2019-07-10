import { UPDATE_SETTINGS } from '../../settings-action-types'
import _ from 'lodash'

const initialState = {
  launcher: '',
  launcherText: '',
  theme: null,
  button: '',
  resultLists: '',
  header: '',
  articleLinks: ''
}

const colorSettings = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        articleLinks: _.get(payload, 'webWidget.color.articleLinks', state.articleLinks),
        button: _.get(payload, 'webWidget.color.button', state.button),
        header: _.get(payload, 'webWidget.color.header', state.header),
        launcher: _.get(payload, 'webWidget.color.launcher', state.launcher),
        launcherText: _.get(payload, 'webWidget.color.launcherText', state.launcherText),
        resultLists: _.get(payload, 'webWidget.color.resultLists', state.resultLists),
        theme: _.get(payload, 'webWidget.color.theme', state.theme)
      }
    default:
      return state
  }
}

export default colorSettings
