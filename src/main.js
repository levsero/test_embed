import { win,
         document,
         navigator    } from './utils/globals';
import { sendData     } from './utils/backend';
import { parseUrl     } from './utils/utils';
import { store        } from './utils/persistence';
import { identity     } from './identity';
import { transport    } from './transport';
import { launcher     } from './services/launcher/Launcher';
import { submitTicket } from './services/submitTicket/submitTicket';

require('imports?_=lodash!lodash');

var url = win.location.origin;
var now = Date.now();
var referrer = parseUrl(document.referrer);
var previousTime = store.get('currentTime', true) || 0;
var beacon = function(opts) {
  url = opts.url || '';

  sendData(opts, function(response) {
    console.log(response);
  });
};

function timeOnLastPage() {
  return referrer.origin === url && previousTime ? (now - previousTime) : 0;
}

store.set('currentTime', now, true);

beacon({
  url: location.href,
  buid: identity.getBuid(),
  useragent: navigator.userAgent,
  referrer: referrer.href,
  time: timeOnLastPage(),
  metrics: ['beacon']
});

launcher.create('demoLauncher', {
  onClick: function() {
    alert('This is Demo Launcher');
  }
});

launcher.render('demoLauncher');

transport.init({ zendeskHost: 'window.zendeskHost'  });

win.Zd = module.exports = {
  identity: identity,
  transport: transport,
  services: {
    launcher: launcher,
    submitTicket: submitTicket
  }
};
