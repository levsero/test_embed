import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'

let isDepartmentSetting = false
let queue = []

export const onSetDepartmentComplete = (callback) => {
  const isSetDepartmentQueueEnabled = isFeatureEnabled(undefined, 'web_widget_set_department_queue')

  if (isSetDepartmentQueueEnabled && isDepartmentSetting) {
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
