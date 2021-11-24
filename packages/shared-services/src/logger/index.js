/* eslint no-console:0 */
import inDebugMode from 'src/util/in-debug-mode'

function log(...args) {
  console?.log?.(...args)
}
function info(...args) {
  console?.info?.(...args)
}
function warn(...args) {
  console?.warn?.(...args)
}
function error(...args) {
  console?.error?.(...args)
}
function devLog(...args) {
  if (inDebugMode()) console?.log?.(...args)
}

export const logger = {
  log,
  devLog,
  info,
  warn,
  error,
}
