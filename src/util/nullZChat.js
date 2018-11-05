let nullZChat = null;
let shouldWarn = false;
const timeBetweenWarnings = 2000;

function resetShouldWarn() {
  shouldWarn = true;
}

if (typeof Proxy !== 'undefined') {
  nullZChat = new Proxy(new Object(), {
    get(_target, prop) {
      if (prop === 'toJSON') return {};

      return (_data) => {
        if (shouldWarn) {
          /* eslint-disable max-len, no-console */
          console.warn('You are trying to use a Zendesk Web Widget API method that is native to the Widget\'s Integrated Chat experience.');
          console.warn('Please go to your Zendesk Widget admin settings and enable the Integrated Chat option to enable this API call.');
          shouldWarn = false;
        } else {
          setTimeout(resetShouldWarn, timeBetweenWarnings);
        }
        return false;
      };
    }
  });
}

export {
  nullZChat,

  resetShouldWarn // for testing purposes
};
