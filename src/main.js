import { win          } from 'util/globals';
import { identity     } from 'service/identity';
import { renderer     } from 'service/renderer';
import { transport    } from 'service/transport';
import { launcher     } from 'embed/launcher/launcher';
import { submitTicket } from 'embed/submitTicket/submitTicket';
import { beacon       } from 'service/beacon';

require('imports?_=lodash!lodash');

transport.init({ zendeskHost: document.zendeskHost });
beacon.init().send();

var readyCallback = win.Zd && win.Zd.readyCallback;

win.Zd = module.exports = {
  identity: identity,
  transport: transport,
  services: {
    launcher: launcher,
    submitTicket: submitTicket
  },
  devRender: renderer.init
};

if(readyCallback && typeof readyCallback === 'function') {
  readyCallback();
}

