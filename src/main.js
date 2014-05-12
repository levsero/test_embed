import { win          } from './utils/globals';
import { identity     } from './identity';
import { transport    } from './transport';
import { launcher     } from './services/launcher/Launcher';
import { submitTicket } from './services/submitTicket/submitTicket';
import { beacon       } from './services/beacon';

require('imports?_=lodash!lodash');

transport.init({ zendeskHost: window.zendeskHost });
beacon.init().send();

launcher.create('demoLauncher', {
  onClick: function() {
    alert('This is Demo Launcher');
  }
});

launcher.render('demoLauncher');

win.Zd = module.exports = {
  identity: identity,
  transport: transport,
  services: {
    launcher: launcher,
    submitTicket: submitTicket
  }
};
