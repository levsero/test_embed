import { isFeatureEnabled } from '@zendesk/widget-shared-services'

let isDepartmentSetting = false
let queue = []

export const onSetDepartmentComplete = (callback) => {
  if (isFeatureEnabled('web_widget_set_department_queue') && isDepartmentSetting) {
    queue.push(callback)
  } else {
    callback()
  }
}

export const setDepartmentPending = () => {
  isDepartmentSetting = true
}

export const setDepartmentComplete = () => {
  isDepartmentSetting = false
  flushQueue()
}

const flushQueue = () => {
  queue.forEach((callback) => callback())
  queue = []
}

// Used solely for testing purposes.
export const resetDepartmentQueue = () => {
  isDepartmentSetting = false
  queue = []
}
