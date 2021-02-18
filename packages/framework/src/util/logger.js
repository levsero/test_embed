/* eslint no-console:0 */
import { inDebugMode } from 'utility/runtime'

const consoleAvailable = Boolean(window.console)

function log(...args) {
  if (consoleAvailable) console.log(...args)
}
function info(...args) {
  if (consoleAvailable) console.info(...args)
}
function warn(...args) {
  if (consoleAvailable) console.warn(...args)
}
function error(...args) {
  if (consoleAvailable) console.error(...args)
}
function devLog(...args) {
  if (consoleAvailable && inDebugMode()) console.log(...args)
}

export default {
  log,
  devLog,
  info,
  warn,
  error,
}
