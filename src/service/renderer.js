import _ from 'lodash';

import { audio } from 'service/audio';
import { chat } from 'embed/chat/chat';
import { launcher } from 'embed/launcher/launcher';
import WebWidgetFactory from 'embed/webWidget/webWidget';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { logging } from 'service/logging';
import { settings } from 'service/settings';
import { win } from 'utility/globals';
import { updateEmbedAccessible } from 'src/redux/modules/base';

const embedsMap = {
  'chat': chat,
  'launcher': launcher,
  'webWidget': new WebWidgetFactory,
  'ipmWidget': new WebWidgetFactory('ipm')
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

  return rendererConfig;
}

const loadAudio = (config) => {
  const { newChat } = config;

  if (newChat) {
    try {
      audio.load('incoming_message', 'https://v2.zopim.com/widget/sounds/triad_gbd');
    } catch (_) { }
  }
};

const dummyStore = {
  dispatch: () => {}
};

function mergeEmbedConfigs(config, embeddableConfig) {
  const embeds = embeddableConfig && embeddableConfig.embeds;

  if (embeds) {
    _.forEach(config.embeds, (value, key) => {
      if (embeds[key]) {
        const newConfig = _.merge({}, embeds[key], config.embeds[key]);

        config.embeds[key] = newConfig;
      }
    });
  }

  return config;
}

function addPropsToConfig(name, config, parsedConfig, reduxStore) {
  const { newChat } = config;
  const webWidgetEmbeds = ['ticketSubmissionForm', 'helpCenterForm', 'talk'];

  // Only send chat to WebWidget if new chat is on. Otherwise use old one.
  if (newChat) webWidgetEmbeds.push('zopimChat');

  const webWidgetConfig = _.chain(parsedConfig)
    .pick(webWidgetEmbeds)
    .mapValues('props')
    .value();

  _.forEach(_.keys(webWidgetConfig), (embed) => {
    const name = embed === 'zopimChat' ? 'chat' : embed;

    reduxStore.dispatch(updateEmbedAccessible(name, true));
  });

  parsedConfig = _.omit(parsedConfig, webWidgetEmbeds);

  parsedConfig[name] = {
    embed: name,
    props: webWidgetConfig
  };

  return parsedConfig;
}

function renderEmbeds(parsedConfig, config, reduxStore) {
  const { newChat } = config;

  _.forEach(parsedConfig, (configItem, embedName) => {
    try {
      const zopimRendered = config.embeds.zopimChat && !newChat;

      reduxStore.dispatch(updateEmbedAccessible(embedName, true));
      configItem.props.visible = config.embeds && !config.embeds.talk && !zopimRendered && !hideLauncher;
      configItem.props.hideZendeskLogo = config.hideZendeskLogo;
      configItem.props.brand = config.brand;

      embedsMap[configItem.embed].create(embedName, configItem.props, reduxStore);
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
}

function init(config, reduxStore = dummyStore) {
  if (!initialised) {
    if (config.webWidgetCustomizations) {
      settings.enableCustomizations();
    }

    i18n.setCustomTranslations();
    i18n.setFallbackTranslations();
    i18n.setLocale(config.locale);
    loadAudio(config);

    const { newChat, embeds = {} } = config;
    const useNewChatEmbed = !!embeds.zopimChat && newChat;
    const hasSingleIframeEmbeds = !!embeds.ticketSubmissionForm
      || !!embeds.helpCenterForm
      || !!embeds.talk
      || useNewChatEmbed;
    let parsedConfig = parseConfig(config);

    if (hasSingleIframeEmbeds) {
      parsedConfig = addPropsToConfig('webWidget', config, parsedConfig, reduxStore);
    }

    renderEmbeds(parsedConfig, config, reduxStore);

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

function initIPM(config, embeddableConfig, reduxStore = dummyStore) {
  config = mergeEmbedConfigs(config, embeddableConfig);
  let parsedConfig = parseConfig(config);

  parsedConfig = addPropsToConfig('ipmWidget', config, parsedConfig, reduxStore);
  renderEmbeds(parsedConfig, config, reduxStore);

  mediator.initIPMStandalone();
}

function initMediator(config) {
  const embeds = config.embeds;

  if (_.get(embeds, 'zopimChat.props.standalone') && !config.newChat) {
    mediator.initZopimStandalone();
  } else if (embeds) {
    const signInRequired = embeds.helpCenterForm
                         ? embeds.helpCenterForm.props.signInRequired
                         : false;
    const submitTicketAccessible = !!embeds.ticketSubmissionForm;
    const zopimChatAccessible = !!embeds.zopimChat;
    const channelChoiceAccessible = settings.get('contactOptions').enabled
                                  && submitTicketAccessible
                                  && zopimChatAccessible;
    const params = {
      hideLauncher: hideLauncher,
      helpCenterSignInRequired: signInRequired,
      newChat: !!config.newChat
    };
    const embedsAccessible = {
      submitTicket: submitTicketAccessible,
      helpCenter: !!embeds.helpCenterForm,
      chat: zopimChatAccessible,
      channelChoice: channelChoiceAccessible,
      talk: !!embeds.talk
    };

    mediator.init(embedsAccessible, params);
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

  renderedEmbedsApply((embed) => {
    embed.updateBaseFontSize(fontSize);
    embed.updateFrameSize();
  });
}

function hideByZoom(hide) {
  renderedEmbedsApply((embed) => {
    embed.setHiddenByZoom(hide);
  });
}

export const renderer = {
  init: init,
  initIPM: initIPM,
  postRenderCallbacks: postRenderCallbacks,
  propagateFontRatio: propagateFontRatio,
  hideByZoom: hideByZoom,
  hide: hide
};
