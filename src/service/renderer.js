import _ from 'lodash';

import { automaticAnswers } from 'embed/automaticAnswers/automaticAnswers';
import { channelChoice } from 'embed/channelChoice/channelChoice';
import { chat } from 'embed/chat/chat';
import { helpCenter } from 'embed/helpCenter/helpCenter';
import { ipm } from 'embed/ipm/ipm';
import { launcher } from 'embed/launcher/launcher';
import { nps } from 'embed/nps/nps';
import { submitTicket } from 'embed/submitTicket/submitTicket';
<<<<<<< f1ab694e2f78acfbdbb81e1c7b50d158efe8a2f2
=======
import { webWidget } from 'embed/webWidget/webWidget';
import { beacon } from 'service/beacon';
>>>>>>> Make single iframe only appear if expanded is true. Otherwise it works as default
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { logging } from 'service/logging';
import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { win } from 'utility/globals';

import createStore from 'src/redux/createStore';

const reduxStore = createStore();

const embedsMap = {
  'submitTicket': submitTicket,
  'helpCenter': helpCenter,
  'nps': nps,
  'ipm': ipm,
  'chat': chat,
  'channelChoice': channelChoice,
  'automaticAnswers': automaticAnswers,
  'launcher': launcher,
  'webWidget': webWidget
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

  if (!rendererConfig.ticketSubmissionForm && rendererConfig.helpCenterForm) {
    rendererConfig.helpCenterForm.props.showNextButton = false;
  }

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
    if (config.webWidgetCustomizations) {
      settings.enableCustomizations();
    }
    i18n.setCustomTranslations();
    i18n.setLocale(config.locale);

    if (settings.get('channelChoice')) {
      embedsMap.channelChoice.create('channelChoice', {});
      embedsMap.channelChoice.render('channelChoice');
    }

    const singleIframe = settings.get('expanded');
    let parsedConfig = parseConfig(config);

    if (singleIframe) {
      const webWidgetEmbeds = _.pick(parsedConfig, ['ticketSubmissionForm', 'helpCenterForm']);
      let webWidgetConfig = {};

      _.forEach(webWidgetEmbeds, (embed, key) => {
        webWidgetConfig[key] = embed.props;
      });

      webWidget.create(webWidgetConfig);
      webWidget.render();

      parsedConfig = _.omit(parsedConfig, ['ticketSubmissionForm', 'helpCenterForm']);
    }

    _.forEach(parsedConfig, function(configItem, embedName) {
      try {
        configItem.props.visible = !hideLauncher && config.embeds && !config.embeds.zopimChat;
        configItem.props.hideZendeskLogo = config.hideZendeskLogo;
        configItem.props.expandable = config.expandable;
        configItem.props.brand = config.brand;
        embedsMap[configItem.embed].create(embedName, configItem.props, reduxStore);
        embedsMap[configItem.embed].render(embedName);
        if (configItem.embed !== 'helpCenterForm') {
          embedsMap[configItem.embed].create(embedName, configItem.props);
          embedsMap[configItem.embed].render(embedName);
        }
      :x

        logging.error({
          error: err,
          context: {
            embedName: embedName,
            configItem: configItem
          }
        });
      }
    });

    renderedEmbeds = parsedConfig;

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
  const embeds = config.embeds;

  if (embeds) {
    const signInRequired = embeds.helpCenterForm
                         ? embeds.helpCenterForm.props.signInRequired
                         : false;
    const params = {
      'hideLauncher': hideLauncher,
      'helpCenterSignInRequired': signInRequired
    };
    const embedsAccessible = {
      submitTicket: !!embeds.ticketSubmissionForm,
      helpCenter: !!embeds.helpCenterForm,
      channelChoice: settings.get('channelChoice')
    };

    mediator.init(embedsAccessible, params);
    // naked zopim
  } else if (embeds && embeds.zopimChat) {
    mediator.initZopimStandalone();
  } else if (_.isEmpty(embeds)) {
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
