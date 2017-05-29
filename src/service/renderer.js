import _ from 'lodash';

import { automaticAnswers } from 'embed/automaticAnswers/automaticAnswers';
import { channelChoice } from 'embed/channelChoice/channelChoice';
import { chat } from 'embed/chat/chat';
import { helpCenter } from 'embed/helpCenter/helpCenter';
import { ipm } from 'embed/ipm/ipm';
import { launcher } from 'embed/launcher/launcher';
import { nps } from 'embed/nps/nps';
import { submitTicket } from 'embed/submitTicket/submitTicket';
import { webWidget } from 'embed/webWidget/webWidget';
import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { logging } from 'service/logging';
import { settings } from 'service/settings';
import { isMobileBrowser } from 'utility/devices';
import { win } from 'utility/globals';
import { updateEmbedAccessible } from 'src/redux/modules/base';

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
      props: {
        anonymousCampaigns: config.ipmAnonymousCampaigns,
        fetchDirectlyFromConnect: config.ipmFetchDirectlyFromConnect
      }
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
      // TODO: do this differently when channelChoice is part of single iframe
      const hasLauncherConfig = config.embeds && config.embeds.launcher;
      const ccConfig = {
        hideZendeskLogo: config.hideZendeskLogo,
        color: hasLauncherConfig ? config.embeds.launcher.props.color : null,
        formTitleKey: hasLauncherConfig ? config.embeds.launcher.props.labelKey : null
      };

      embedsMap.channelChoice.create('channelChoice', ccConfig, reduxStore);
      embedsMap.channelChoice.render('channelChoice');
    }

    const singleIframe = config.singleIframe;
    let parsedConfig = parseConfig(config);

    if (singleIframe) {
      const webWidgetEmbeds = ['ticketSubmissionForm', 'zopimChat', 'helpCenterForm'];
      const webWidgetConfig = _.chain(parsedConfig)
                               .pick(webWidgetEmbeds)
                               .mapValues('props')
                               .value();

      parsedConfig = _.omit(parsedConfig, webWidgetEmbeds);

      parsedConfig.webWidget = {
        embed: 'webWidget',
        props: webWidgetConfig
      };
    }

    _.forEach(parsedConfig, (configItem, embedName) => {
      try {
        const zopimRendered = config.embeds.zopimChat && !singleIframe;

        reduxStore.dispatch(updateEmbedAccessible(embedName, true));
        configItem.props.visible = !hideLauncher && config.embeds && !zopimRendered;
        configItem.props.hideZendeskLogo = config.hideZendeskLogo;
        configItem.props.disableAutoComplete = config.disableAutoComplete;
        configItem.props.expandable = config.expandable;
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
      channelChoice: settings.get('channelChoice'),
      chat: !!embeds.zopimChat
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
