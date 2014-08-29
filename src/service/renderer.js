import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher }     from 'embed/launcher/launcher';
import { helpCenter }   from 'embed/helpCenter/helpCenter';
import { chat }         from 'embed/chat/chat';
import { i18n }         from 'service/i18n';

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
      /* jshint laxbreak: true */
      result[key] = (_.isObject(value))
                  ? function(...args) {
                      args.unshift(value.name);
                      return embedsMap[config[value.name].embed][value.method].apply(null, args);
                    }
                  : value;

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
  }

  initialised = true;
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

export var renderer = {
  init: init,
  propagateFontRatio: propagateFontRatio
};
