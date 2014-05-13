import { win          } from 'util/globals';
import { identity     } from 'service/identity';
import { transport    } from 'service/transport';
import { launcher     } from 'embed/launcher/launcher';
import { submitTicket } from 'embed/submitTicket/submitTicket';
import { beacon       } from 'service/beacon';

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
