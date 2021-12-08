import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import _ from 'lodash'

const defaultOptions = {
    showToday: false,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },
  minuteOptions = {
    hour: 'numeric',
    minute: 'numeric',
  }

export function dateTime(timestamp, options = {}) {
  const mergedOpts = _.merge({}, defaultOptions, options)
  const messageFormattedDate = i18n.dateTimeFormat(timestamp, mergedOpts)

  if (mergedOpts.showToday && isToday(timestamp)) {
    const localMinutes = i18n.dateTimeFormat(timestamp, minuteOptions)

    return i18n.t('embeddable_framework.common.today', {
      time: localMinutes,
    })
  }

  return messageFormattedDate
}

const isToday = (inStamp) => {
  const inDate = new Date(inStamp),
    today = new Date()

  return (
    inDate.getDate() === today.getDate() &&
    inDate.getMonth() === today.getMonth() &&
    inDate.getFullYear() === today.getFullYear()
  )
}
