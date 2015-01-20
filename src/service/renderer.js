import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher }     from 'embed/launcher/launcher';
import { helpCenter }   from 'embed/helpCenter/helpCenter';
import { chat }         from 'embed/chat/chat';
import { i18n }         from 'service/i18n';
import { mediator }     from 'service/mediator';
import { logging }      from 'service/logging';

require('imports?_=lodash!lodash');

var embedsMap = {
      'submitTicket': submitTicket,
      'launcher'    : launcher,
      'helpCenter'  : helpCenter,
      'chat'        : chat
    },
    initialised = false,
    isVisible = true,
    renderedEmbeds;

function hide() {
  isVisible = false;
}

function parseConfig(config) {
  var rendererConfig = _.clone(config.embeds, true);

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
        configItem.props.visible = isVisible;
        if (_.isBoolean(config.zendeskLogoEnabled)) {
          configItem.props.zendeskLogoEnabled = config.zendeskLogoEnabled;
        }
        embedsMap[configItem.embed].create(embedName, configItem.props);
        embedsMap[configItem.embed].render(embedName);
      } catch (err) {
        logging.error({
          error: err,
          context: {
            embedName: embedName,
            configItem: configItem
          }
        });
      }
    });

    renderedEmbeds = config.embeds;

    initMediator(config);

    initialised = true;
  }
}

function initMediator(config) {
  /* jshint laxbreak: true */

  switch(config.ruleset) {
    case 'HC_C_TS':
      mediator.initHelpCenterChatTicketSubmission();
      break;
    case 'HC_TS':
      mediator.initHelpCenterTicketSubmission();
      break;
    case 'C_TS':
      mediator.initChatTicketSubmission();
      break;
    case 'TS':
      mediator.initTicketSubmission();
      break;
    case '':
      // blank render list
      break;
    default:
      logging.error({
        error: {
          message: 'Could not find a suitable mediator ruleset to initialise.'
        },
        params: {
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

    if (currentEmbed) {
      currentEmbed.updateBaseFontSize(fontSize);
      currentEmbed.updateFrameSize();
    }
  });
}

function hideByZoom(hide) {
  var currentEmbed;

  _.forEach(renderedEmbeds, function(embed, name) {
    currentEmbed = embedsMap[embed.embed].get(name).instance;

    if (currentEmbed) {
      currentEmbed.setHiddenByZoom(hide);
    }
  });
}

var hardcodedConfigs = {
  zendeskWithChat: {
    'embeds': {
      'zopimChat': {
        'embed': 'chat',
        'props': {
          'zopimId': '2ItCA9Tu3W5bksDB4EJzPSCz4kIymONo'
        }
      },
      'launcher': {
        'embed': 'launcher',
        'props': {
          'position': 'right'
        }
      },
      'ticketSubmissionForm': {
        'embed': 'submitTicket',
        'props': {}
      }
    },
    ruleset: 'C_TS'
  },
  zendeskDefault: {
    'embeds': {
      'helpCenterForm': {
        'embed': 'helpCenter',
        'props': { }
      },
      'zopimChat': {
        'embed': 'chat',
        'props': {
          'zopimId': '2ItCA9Tu3W5bksDB4EJzPSCz4kIymONo'
        }
      },
      'launcher': {
        'embed': 'launcher',
        'props': {
          'position': 'right'
        }
      },
      'ticketSubmissionForm': {
        'embed': 'submitTicket',
        'props': {}
      }
    },
    ruleset: 'HC_C_TS'
  }
};

export var renderer = {
  init: init,
  propagateFontRatio: propagateFontRatio,
  hideByZoom: hideByZoom,
  hardcodedConfigs: hardcodedConfigs,
  hide: hide
};
