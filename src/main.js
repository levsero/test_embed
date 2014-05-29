import { win       } from 'util/globals';
import { renderer  } from 'service/renderer';
import { transport } from 'service/transport';
import { beacon    } from 'service/beacon';

require('imports?_=lodash!lodash');

transport.init({ zendeskHost: document.zendeskHost });
beacon.init().send();

var readyCallback = win.Zd && win.Zd.readyCallback;

win.Zd = module.exports = {
  devRender: renderer.init
};

if (readyCallback && typeof readyCallback === 'function') {
  readyCallback();
}

// Until transport config is setup we hard code the config call
renderer.init({
  'ticketSubmissionForm': {
    'embed': 'submitTicket'
  },
  'ticketSubmissionLauncher': {
    'embed': 'launcher',
    'props': {
      'position': 'right',
      'onClick': {
        name: 'ticketSubmissionForm',
        method: 'show'
      }
    }
  }
});

