module React from 'react';
import { beacon    } from 'service/beacon';
import { renderer  } from 'service/renderer';
import { transport } from 'service/transport';
import { win       } from 'util/globals';

require('imports?_=lodash!lodash');

React.initializeTouchEvents(true);

transport.init({ zendeskHost: document.zendeskHost });
beacon.init().send();

win.Zd = module.exports = {
  devRender: renderer.init
};

_.each(document.ZdQueue, function(item) {
  if (item[0] === 'ready') {
    item[1](win.Zd);
  }
});

// Until transport config is setup we hard code the config call
renderer.init({
  'ticketSubmissionForm': {
    'embed': 'submitTicket',
    'props': {
      'onShow': {
        name: 'ticketSubmissionLauncher',
        method: 'hide'
      },
      'onHide': {
        name: 'ticketSubmissionLauncher',
        method: 'show'
      }
    }
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

