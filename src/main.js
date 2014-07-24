module React from 'react';
import { beacon    } from 'service/beacon';
import { renderer  } from 'service/renderer';
import { transport } from 'service/transport';
import { win       } from 'util/globals';

require('imports?_=lodash!lodash');

function boot() {
  var publicApi;

  React.initializeTouchEvents(true);

  transport.bustCache();

  transport.init({ zendeskHost: document.zendeskHost });
  beacon.init().send();

  publicApi = {
    devRender: renderer.init,
    bustCache: transport.bustCache
  };

  if (win.zE === win.zEmbed) {
    win.zE = win.zEmbed = publicApi;
  } else {
    win.zEmbed = publicApi;
  }
  
  _.each(document.zEQueue, function(item) {
    if (item[0] === 'ready') {
      item[1](win.zEmbed);
    }
  });

  // Until transport config is setup we hard code the config call
  renderer.init({
    'ticketSubmissionForm': {
      'embed': 'submitTicket',
      'props': {
        'onShow': {
          name: 'ticketSubmissionLauncher',
          method: 'update'
        },
        'onHide': {
          name: 'ticketSubmissionLauncher',
          method: 'update'
        }
      }
    },
    'ticketSubmissionLauncher': {
      'embed': 'launcher',
      'props': {
        'position': 'right',
        'onClick': {
          name: 'ticketSubmissionForm',
          method: 'update'
        }
      }
    }
  });
}

if (!_.isUndefined(document.zendeskHost)) {
  boot();
}
