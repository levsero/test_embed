/* eslint no-console:0 */
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

export default {
  log,
  info,
  warn,
  error
}
