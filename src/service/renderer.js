import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher }     from 'embed/launcher/launcher';
import { helpCenter }   from 'embed/helpCenter/helpCenter';
import { chat }         from 'embed/chat/chat';
import { i18n }         from 'service/i18n';
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
  var rendererConfig = _.clone(config.embeds || config, true);

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
    i18n.setLocale(config.locale);

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

    renderedEmbeds = config.ruleset || config.embeds || config;

    initMediator(renderedEmbeds);

    initialised = true;
  }
}

function initMediator(config) {
  /* jshint laxbreak: true */
  var embeds = (!_.isObject(config))
             ? config
             : _.chain(config)
               .keys()
               .sortBy()
               .value()
               .join('_');

  switch(embeds) {
    case 'hcLauncher_helpCenterForm_ticketSubmissionForm_zopimChat':
      mediator.initHelpCenterChatTicketSubmission('hcLauncher');
      break;
    case 'HC_C_TS':
      mediator.initHelpCenterChatTicketSubmission();
      break;
    case 'hcLauncher_helpCenterForm_ticketSubmissionForm':
      mediator.initHelpCenterTicketSubmission('hcLauncher');
      break;
    case 'HC_TS':
      mediator.initHelpCenterTicketSubmission();
      break;
    case 'chatLauncher_ticketSubmissionForm_zopimChat':
      mediator.initChatTicketSubmission('chatLauncher');
      break;
    case 'C_TS':
      mediator.initChatTicketSubmission();
      break;
    case 'ticketSubmissionForm_ticketSubmissionLauncher':
      mediator.initTicketSubmission('ticketSubmissionLauncher');
      break;
    case 'TS':
      mediator.initTicketSubmission();
      break;
    case '':
      // blank render list
      break;
    default:
      Airbrake.push({
        error: {
          message: 'Could not find a suitable mediator ruleset to initialise.'
        },
        params: {
          embeds: embeds,
          config: config
        }
      });
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
        'zopimId': '2ItCA9Tu3W5bksDB4EJzPSCz4kIymONo'
      }
    },
    'chatLauncher': {
      'embed': 'launcher',
      'props': {
        'position': 'right'
      }
    },
    'ticketSubmissionForm': {
      'embed': 'submitTicket',
      'props': {}
    }
  }
};

export var renderer = {
  init: init,
  propagateFontRatio: propagateFontRatio,
  hardcodedConfigs: hardcodedConfigs
};
