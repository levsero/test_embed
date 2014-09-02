import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher }     from 'embed/launcher/launcher';
import { helpCenter }   from 'embed/helpCenter/helpCenter';
import { chat }         from 'embed/chat/chat';
import { mediator }     from 'service/mediator';

require('imports?_=lodash!lodash');

var embedsMap = {
      'submitTicket': submitTicket,
      'launcher'    : launcher,
      'helpCenter'  : helpCenter,
      'chat'        : chat
    },
    initialised = false,
    renderedEmbeds;

function parseConfig(config) {
  var rendererConfig = _.clone(config, true);

  _.forEach(rendererConfig, function(configItem) {
    configItem.props = _.reduce(configItem.props, function(result, value, key) {
      /* jshint laxbreak: true */
      result[key] = (_.isObject(value))
                  ? function(...args) {
                      args.unshift(value.name);
                      return embedsMap[config[value.name].embed][value.method].apply(null, args);
                    }
                  : value;

      return result;
    }, {});
  });

  return rendererConfig;
}

function init(config) {
  if (!initialised) {
    _.forEach(parseConfig(config), function(configItem, embedName) {
      try {
        embedsMap[configItem.embed].create(embedName, configItem.props);
        embedsMap[configItem.embed].render(embedName);
      } catch (err) {
        Airbrake.push({
          error: err,
          context: {
            embedName: embedName,
            configItem: configItem
          }
        });
      }
    });

    renderedEmbeds = config;
    initChatTicketSubmissionMediator();
    initialised = true;
  }
}

function initChatTicketSubmissionMediator() {
  var state = {
    'ticketSubmissionForm.isVisible': false,
    'zopimChat.isVisible': false,
    'zopimChat.isOnline': false,
    'zopimChat.unreadMsgs': 0
  };

  mediator.channel.intercept('zopimChat.onOnline', function() {
    state['zopimChat.isOnline'] = true;
    mediator.channel.broadcast('chatLauncher.setLabelChat');
  });

  mediator.channel.intercept('zopimChat.onOffline', function() {
    state['zopimChat.isOnline'] = false;
    mediator.channel.broadcast('chatLauncher.setLabelHelp');
  });

  mediator.channel.intercept('zopimChat.onShow', function() {
    state['zopimChat.isVisible'] = true;
    mediator.channel.broadcast('chatLauncher.activate');
  });

  mediator.channel.intercept('zopimChat.onUnreadMsgs', function(b, count) {
    console.log('unreadMsg', count);
    state['zopimChat.unreadMsgs'] = count;
    if (state['zopimChat.isOnline']) {
      mediator.channel.broadcast('chatLauncher.setLabelUnreadMsgs', count);
    }
  });

  mediator.channel.intercept(
    ['chatLauncher.onClick',
     'ticketSubmissionForm.onClose'].join(','),
    function() {
      if (state['zopimChat.isVisible'] || state['ticketSubmissionForm.isVisible']) {
        if (state['zopimChat.isVisible']) {
          mediator.channel.broadcast('zopimChat.hide');
          state['zopimChat.isVisible'] = false;
        }
        if (state['ticketSubmissionForm.isVisible']) {
          mediator.channel.broadcast('ticketSubmissionForm.hide');
          state['ticketSubmissionForm.isVisible'] = false;
        }
        mediator.channel.broadcast('chatLauncher.deactivate');
      }
      else {
        if (state['zopimChat.isOnline']) {
          mediator.channel.broadcast('zopimChat.show');
          state['zopimChat.isVisible'] = true;
        }
        else {
          mediator.channel.broadcast('ticketSubmissionForm.show');
          state['ticketSubmissionForm.isVisible'] = true;
        }
        mediator.channel.broadcast('chatLauncher.activate');
      }
    });

  mediator.channel.subscribe('chatLauncher.deactivate', function() {
    if (state['zopimChat.isOnline']) {
      mediator.channel.broadcast('chatLauncher.setLabelChat');
    }
    else {
      mediator.channel.broadcast('chatLauncher.setLabelHelp');
    }
  });
}

function initTicketSubmissionMediator() {
  var state = {
    'ticketSubmissionForm.isVisible': false,
    'zopimChat.isVisible': false,
    'zopimChat.isOnline': false
  };

  mediator.channel.intercept(
    ['ticketSubmissionLauncher.onClick',
     'ticketSubmissionForm.onClose'].join(','),
    function() {
      if (state['ticketSubmissionForm.isVisible']) {
        mediator.channel.broadcast('ticketSubmissionForm.hide');
        mediator.channel.broadcast('ticketSubmissionLauncher.deactivate');
        state['ticketSubmissionForm.isVisible'] = false;
      }
      else {
        mediator.channel.broadcast('ticketSubmissionForm.show');
        mediator.channel.broadcast('ticketSubmissionLauncher.activate');
        state['ticketSubmissionForm.isVisible'] = true;
      }
    });
}

function propagateFontRatio(ratio) {
  var fontSize = (12 * ratio) + 'px',
      currentEmbed;

  _.forEach(renderedEmbeds, function(embed, name) {
    currentEmbed = embedsMap[embed.embed].get(name).instance;
    currentEmbed.updateBaseFontSize(fontSize);
    currentEmbed.updateFrameSize();
  });
}

var hardcodedConfigs = {
  zendeskWithChat: {
    'zopimChat': {
      'embed': 'chat',
      'props': {
        'zopimId': '2ItCA9Tu3W5bksDB4EJzPSCz4kIymONo',
        'onShow': {
          name: 'chatLauncher',
          method: 'update'
        },
        'onHide': {
          name: 'chatLauncher',
          method: 'update'
        },
        'setIcon': {
          name: 'chatLauncher',
          method: 'setIcon'
        },
        'setLabel': {
          name: 'chatLauncher',
          method: 'setLabel'
        },
        'updateForm': {
          name: 'ticketSubmissionForm',
          method: 'update'
        }
      }
    },
    'chatLauncher': {
      'embed': 'launcher',
      'props': {
        'position': 'right',
        'onClick': {
          name: 'zopimChat',
          method: 'update'
        }
      }
    },
    'ticketSubmissionForm': {
      'embed': 'submitTicket',
      'props': {
        'onShow': {
          name: 'chatLauncher',
          method: 'update'
        },
        'onHide': {
          name: 'chatLauncher',
          method: 'update'
        }
      }
    }
  }
};

export var renderer = {
  init: init,
  propagateFontRatio: propagateFontRatio,
  hardcodedConfigs: hardcodedConfigs
};
