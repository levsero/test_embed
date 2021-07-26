import _ from 'lodash'
import { validatedColor } from 'src/util/color/validate'
import { UPDATE_SETTINGS } from '../../settings-action-types'

const initialState = {
  launcher: '',
  launcherText: '',
  theme: null,
  button: '',
  resultLists: '',
  header: '',
  articleLinks: '',
}

const colorSettings = (state = initialState, action) => {
  const { type, payload } = action

  const getColor = (setting) => {
    const color = validatedColor(_.get(payload, `webWidget.color.${setting}`))

    return color ? color : state[setting]
  }

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        articleLinks: getColor('articleLinks'),
        button: getColor('button'),
        header: getColor('header'),
        launcher: getColor('launcher'),
        launcherText: getColor('launcherText'),
        resultLists: getColor('resultLists'),
        theme: getColor('theme'),
      }
    default:
      return state
  }
}

export default colorSettings
