import { win          } from './utils/globals';
import { store        } from './utils/persistence';
import { identity     } from './identity';
import { transport    } from './transport';
import { launcher     } from './services/launcher/Launcher';
import { submitTicket } from './services/submitTicket/submitTicket';
import { beacon       } from './services/beacon';

require('imports?_=lodash!lodash');

transport.init({ zendeskHost: window.zendeskHost });
var now = Date.now();

store.set('currentTime', now, true);

launcher.create('demoLauncher', {
  onClick: function() {
    alert('This is Demo Launcher');
  }
});

launcher.render('demoLauncher');

beacon.send();

win.Zd = module.exports = {
  identity: identity,
  transport: transport,
  services: {
    launcher: launcher,
    submitTicket: submitTicket
  }
};
