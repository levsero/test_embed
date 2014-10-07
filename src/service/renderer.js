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
      result[key] = value;
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

    initMediator(config);

    initialised = true;
  }
}

function initMediator(config) {
  var embeds = _.chain(config)
                .keys()
                .sortBy()
                .value()
                .join('_');

  switch(embeds) {
    case 'hcLauncher_helpCenterForm_ticketSubmissionForm_zopimChat':
      mediator.initHelpCenterChatTicketSubmissionMediator();
      break;
    case 'hcLauncher_helpCenterForm_ticketSubmissionForm':
      mediator.initHelpCenterTicketSubmissionMediator();
      break;
    case 'chatLauncher_ticketSubmissionForm_zopimChat':
      mediator.initChatTicketSubmissionMediator();
      break;
    case 'ticketSubmissionForm_ticketSubmissionLauncher':
      mediator.initTicketSubmissionMediator();
      break;
  }
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
