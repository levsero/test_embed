import _ from 'lodash';

import { automaticAnswers } from 'embed/automaticAnswers/automaticAnswers';
import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher } from 'embed/launcher/launcher';
import { helpCenter } from 'embed/helpCenter/helpCenter';
import { chat } from 'embed/chat/chat';
import { nps } from 'embed/nps/nps';
import { ipm } from 'embed/ipm/ipm';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { logging } from 'service/logging';
import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { win } from 'utility/globals';

const embedsMap = {
  'submitTicket': submitTicket,
  'launcher': launcher,
  'helpCenter': helpCenter,
  'nps': nps,
  'ipm': ipm,
  'chat': chat,
  'automaticAnswers': automaticAnswers
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
    settings.init(config.webWidgetCustomizations);
    beacon.trackSettings(settings.getTrackSettings());
    i18n.init(config.locale);

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
    const signInRequired = config.embeds.helpCenterForm
                         ? config.embeds.helpCenterForm.props.signInRequired
                         : false;
    const params = {
      'hideLauncher': hideLauncher,
      'helpCenterSignInRequired': signInRequired
    };

    mediator.init(!!config.embeds.helpCenterForm, params);
  } else if (config.embeds && config.embeds.zopimChat) {
    // naked zopim
    mediator.initZopimStandalone();
  } else if (config.embeds && _.isEmpty(config.embeds)) {
    // No embeds
    mediator.initMessaging();
  } else {
    logging.error({
      error: {
        message: 'Could not find correct embeds to initialise.'
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

function postRenderCallbacks() {
  _.forEach(renderedEmbeds, function(embed, name) {
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

export const renderer = {
  init: init,
  postRenderCallbacks: postRenderCallbacks,
  propagateFontRatio: propagateFontRatio,
  hideByZoom: hideByZoom,
  hide: hide
};
