import { win }          from 'utility/globals';
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
        configItem.props.hideZendeskLogo = config.hideZendeskLogo;
        configItem.props.brand = config.brand;
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

    if (Math.abs(win.orientation) === 90) {
      hideByZoom(true);
    }

    mediator.channel.subscribe('.updateZoom', function(ratio) {
      propagateFontRatio(ratio);
    });
  }
}

function initMediator(config) {
  if (config.embeds && config.embeds.ticketSubmissionForm) {
    mediator.init(config.embeds.helpCenterForm);
  } else if ((config.embeds && config.embeds.zopimChat) || _.isEmpty(config.embeds)) {
    //naked zopim or empty config
    return;
  } else {
    logging.error({
        error: {
          message: 'Could not find embeds to initialise.'
        },
        params: {
          config: config
        }
      });
  }
}

function renderedEmbedsApply(fn) {
  _.forEach(renderedEmbeds, function(embed, name) {
    var currentEmbed = embedsMap[embed.embed].get(name).instance;

    if (currentEmbed) {
      fn(currentEmbed);
    }
  });
}

function propagateFontRatio(ratio) {
  var fontSize = (12 * ratio) + 'px';

  renderedEmbedsApply(function(embed) {
    embed.updateBaseFontSize(fontSize);
    embed.updateFrameSize();
  });
}

function hideByZoom(hide) {
  renderedEmbedsApply(function(embed) {
    embed.setHiddenByZoom(hide);
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
