let nullZChat = null;

if (typeof Proxy !== 'undefined') {
  nullZChat = new Proxy(new Object(), {
    get(_target, prop) {
      if (prop === 'toJSON') return {};

      return (_data) => {
        /* eslint-disable max-len, no-console */
        console.warn('You are trying to use a Zendesk Web Widget API method that is native to the Widget\'s Integrated Chat experience.');
        console.warn('Please go to your Zendesk Widget admin settings and enable the Integrated Chat option to enable this API call.');
        return false;
      };
    }
  });
}

export { nullZChat };
