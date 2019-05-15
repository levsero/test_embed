import _ from 'lodash';

import { chat } from 'embed/chat/chat';
import { launcher } from 'embed/launcher/launcher';
import WebWidgetFactory from 'embed/webWidget/webWidget';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { logging } from 'service/logging';
import { settings } from 'service/settings';
import { win } from 'utility/globals';
import {
  updateEmbedAccessible,
  updateArturos,
  widgetInitialised
} from 'src/redux/modules/base';
import { FONT_SIZE } from 'constants/shared';
import { setLocaleApi } from 'src/service/api/apis';

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

  const widgetEmbedsConfig = _.pick(parsedConfig, webWidgetEmbeds);
  const webWidgetConfig = _.mapValues(widgetEmbedsConfig, 'props');

  _.keys(webWidgetConfig).forEach((embed) => {
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
  _.forEach(parsedConfig, (configItem, embedName) => {
    try {
      reduxStore.dispatch(updateEmbedAccessible(embedName, true));
      configItem.props.visible = config.embeds && !config.embeds.talk && !config.embeds.zopimChat && !hideLauncher;
      configItem.props.brand = config.brand;
      configItem.props.color = { base: config.color, text: config.textColor };
      configItem.props.brandCount = config.brandCount;

      embedsMap[configItem.embed].create(embedName, configItem.props, reduxStore);
      embedsMap[configItem.embed].render(embedName);
    } catch (err) {
      const customData = {
        embedName: embedName,
        configItem: configItem
      };

      if (!_.isEmpty(err)) {
        logging.error(err, customData);
      }
    }
  });
}

function init(config, reduxStore = dummyStore) {
  if (!initialised) {
    if (config.webWidgetCustomizations) {
      settings.enableCustomizations();
    }

    if (!i18n.getLocale()) {
      setLocaleApi(config.locale);
    }

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

    const arturos = {
      newChat: !!newChat,
      chatPopout: !!config.chatPopout,
      chatBadge: !!config.chatBadge
    };

    reduxStore.dispatch(updateArturos(arturos));
    renderEmbeds(parsedConfig, config, reduxStore);

    renderedEmbeds = parsedConfig;

    initMediator(config, reduxStore);
    reduxStore.dispatch(widgetInitialised(arturos));

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
}

function initMediator(config, store) {
  const embeds = config.embeds;

  if (_.get(embeds, 'zopimChat.props.standalone') && !config.newChat) {
    mediator.initZopimStandalone();
  } else if (embeds) {
    mediator.init(store);
  } else if (!_.isEmpty(embeds)) {
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
      if (currentEmbed.getWrappedInstance) {
        fn(currentEmbed.getWrappedInstance());
      } else {
        fn(currentEmbed);
      }
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
  const fontSize = (FONT_SIZE * ratio.toFixed(2)) + 'px';

  renderedEmbedsApply((embed) => {
    embed.updateBaseFontSize(fontSize);
  });
}

function hideByZoom(hide) {
  renderedEmbedsApply((embed) => {
    embed.setHiddenByZoom(hide);
  });
}

function updateEmbeds() {
  renderedEmbedsApply((embed) => {
    embed.forceUpdateWorld();
  });
}

export const renderer = {
  init: init,
  initIPM: initIPM,
  postRenderCallbacks: postRenderCallbacks,
  propagateFontRatio: propagateFontRatio,
  hideByZoom: hideByZoom,
  hide: hide,
  updateEmbeds
};
