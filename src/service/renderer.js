import _ from 'lodash';

import { win }          from 'utility/globals';
import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher }     from 'embed/launcher/launcher';
import { helpCenter }   from 'embed/helpCenter/helpCenter';
import { chat }         from 'embed/chat/chat';
import { nps }          from 'embed/nps/nps';
import { ipm }          from 'embed/ipm/ipm';
import { i18n }         from 'service/i18n';
import { mediator }     from 'service/mediator';
import { logging }      from 'service/logging';
import { isMobileBrowser } from 'utility/devices';

const embedsMap = {
  'submitTicket': submitTicket,
  'launcher': launcher,
  'helpCenter': helpCenter,
  'nps': nps,
  'ipm': ipm,
  'chat': chat
};
let initialised = false;
let hideLauncher = false;
let renderedEmbeds;

function hide() {
  hideLauncher = true;
}

function parseConfig(config) {
  const rendererConfig = _.clone(config.embeds, true) || {};

  _.forEach(rendererConfig, function(configItem) {
    configItem.props = _.reduce(configItem.props, function(result, value, key) {
      result[key] = value;
      return result;
    }, {});
  });

  rendererConfig.nps = {
    embed: 'nps',
    props: {}
  };

  if (!isMobileBrowser()) {
    rendererConfig.ipm = {
      embed: 'ipm',
      props: {}
    };
  }

  return rendererConfig;
}

function init(config) {
  if (!initialised) {
    i18n.setLocale(config.locale);

    _.forEach(parseConfig(config), function(configItem, embedName) {
      try {
        configItem.props.visible = !hideLauncher && config.embeds && !config.embeds.zopimChat;
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

    postRenderCallbacks(renderedEmbeds);

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
    const signIn = config.embeds.helpCenterForm
                 ? config.embeds.helpCenterForm.props.signInRequired
                 : false;
    const params = {
      'hideLauncher': hideLauncher,
      'helpCenterSignInRequired': signIn
    };

    mediator.init(!!config.embeds.helpCenterForm, params);
  } else if ((config.embeds && config.embeds.zopimChat) || _.isEmpty(config.embeds)) {
    // naked zopim or empty config
    mediator.initMessaging();
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
    const currentEmbed = embedsMap[embed.embed].get(name).instance;

    if (currentEmbed) {
      fn(currentEmbed);
    }
  });
}

function postRenderCallbacks(embeds) {
  _.forEach(embeds, function(embed, name) {
    const currentEmbed = embedsMap[embed.embed];

    if (currentEmbed.postRender) {
      currentEmbed.postRender(name);
    }
  });
}

function propagateFontRatio(ratio) {
  const fontSize = (12 * ratio.toFixed(2)) + 'px';

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

const hardcodedConfigs = {
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
    }
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
    }
  }
};

export const renderer = {
  init: init,
  propagateFontRatio: propagateFontRatio,
  hideByZoom: hideByZoom,
  hardcodedConfigs: hardcodedConfigs,
  hide: hide
};
