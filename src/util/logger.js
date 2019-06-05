const consoleAvailable = Boolean(window.console);

function log(...args) { if (consoleAvailable) console.log(...args); } // eslint-disable-line no-console
function info(...args) { if (consoleAvailable) console.info(...args); } // eslint-disable-line no-console
function warn(...args) { if (consoleAvailable) console.warn(...args); } // eslint-disable-line no-console
function error(...args) { if (consoleAvailable) console.error(...args); } // eslint-disable-line no-console

export default {
  log,
  info,
  warn,
  error,
};
