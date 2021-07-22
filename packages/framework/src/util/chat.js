import _ from 'lodash'
import { AGENT_BOT } from 'constants/chat'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { win, getZendeskHost } from 'utility/globals'

/**
 * Return a new array with consecutive numbers combined into an array containing only the start and end (inclusive) number.
 * @param {NumberLike[]} numbers
 * @returns {NumberRange[]} numberRanges
 */
function combineNumbers(numbers) {
  const result = []
  let last, start

  const dump = () => (start = (result.push(start ? [start, last] : last), undefined))

  numbers.forEach((num) => {
    num = parseInt(num, 10)
    if (last === num - 1) {
      if (!start) start = last
    } else if (last) dump()
    last = num
  })

  dump()
  return result
}

const periodsToString = (periods) =>
  periods.map((period) => `${period.start},${period.end}`).toString()
const stringToPeriods = (str) =>
  str
    ? _.chunk(str.split(','), 2).map((arr) => ({
        start: parseInt(arr[0], 10),
        end: parseInt(arr[1], 10),
      }))
    : []

/**
 * Return a FormattedSchedule array that is more amendable to the Widget's rendering needs.
 * @param {Schedule} schedule
 * @return {FormattedSchedule[]}
 */
function formatSchedule(schedule) {
  schedule = { ...schedule, 7: schedule[0] } // use 7 for Sunday
  delete schedule[0]
  let preprocessedDates = _.invertBy(_.mapValues(schedule, periodsToString))

  return _.sortBy(
    _.map(preprocessedDates, (days, periods) => ({
      periods: stringToPeriods(periods),
      days: combineNumbers(days),
    })),
    ['days']
  )
}

function isAgent(nick) {
  return nick.indexOf('agent:') > -1 && nick !== AGENT_BOT
}

function isVisitor(nick) {
  return nick.indexOf('visitor') > -1 && nick !== AGENT_BOT
}

function isDefaultNickname(name) {
  const nameRegex = new RegExp(/^Visitor [0-9]{3,}$/)

  return nameRegex.test(name)
}

function getDisplayName(inName, fallbackName = '') {
  return isDefaultNickname(inName) ? fallbackName : inName
}

function createChatPopoutWindow(chatPopoutSettings, machineId, locale) {
  let url

  if (__DEV__) {
    url = '/liveChat.html'
  } else {
    url = `${__ASSET_BASE_PATH__}/web_widget/latest/liveChat.html`
  }

  url += generateQueryString(chatPopoutSettings, machineId, locale)

  win.open(url, 'WebWidgetLiveChat', 'height=600,width=400')
}

function encodeSettings(settings) {
  return win.btoa(encodeURIComponent(JSON.stringify(settings)))
}

function generateQueryString(settings, machineId, locale) {
  const subdomain = getZendeskHost(document)

  const encodedSettings = encodeSettings(settings)

  const title = encodeURI(i18n.t('embeddable_framework.popout.title'))

  return `?v=10#key=${subdomain}&settings=${encodedSettings}&mid=${machineId}&locale=${locale}&title=${title}`
}

function cleanBrandName(brand) {
  if (brand) {
    return brand.replace(/,/g, '')
  }
}

export {
  combineNumbers,
  formatSchedule,
  isDefaultNickname,
  isAgent,
  isVisitor,
  createChatPopoutWindow,
  getDisplayName,
  cleanBrandName,
}

/**
 * A number, or a string containing a number.
 * @typedef {(number|string)} NumberLike
 */

/**
 * A number representing a single number, or a 2-element array representing a range of consecutive numbers.
 * @typedef {(number|[number, number])} NumberRange
 */

/**
 * An object representing an operating period. Values refer to the number of minutes since midnight
 * (0 means midnight, 1439 means 23:59)
 * @typedef {object} Period
 * @property {number} start
 * @property {number} end
 */

/**
 * An object containing an operating hours schedule. 0 is for Sunday, 1 for Monday, etc.
 * The properties do NOT actually have underscore prefixed.
 * @typedef {object} Schedule
 * @property {Period[]} _0
 * @property {Period[]} _1
 * @property {Period[]} _2
 * @property {Period[]} _3
 * @property {Period[]} _4
 * @property {Period[]} _5
 * @property {Period[]} _6
 */

/**
 * An object containing operating periods and the applicable days. Sunday is represented by 7 here.
 * @typedef {object} FormattedSchedule
 * @property {NumberRange[]} days
 * @property {Periods[]} periods
 */
