import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher     } from 'embed/launcher/launcher';
require('imports?_=lodash!lodash');

var embedsMap = {
  'submitTicket': submitTicket,
  'launcher': launcher
};

function parseConfig(config) {
  var rendererConfig = _.clone(config, true);

  _.forEach(rendererConfig, function(configItem) {
    configItem.props = _.reduce(configItem.props, function(result, value, key) {
      result[key] = (_.isObject(value))
                  /* jshint laxbreak: true */
                  ? function() {
                    embedsMap[config[value.name].embed][value.method](value.name);
                  }
                  : value;

      return result;
    }, {});
  });

  return rendererConfig;
}

function init(config) {
    _.forEach(parseConfig(config), function(configItem, embedName) {
      try {
        embedsMap[configItem.embed].create(embedName, configItem.props);
        embedsMap[configItem.embed].render(embedName);
      } catch (err) {
        // TODO: revisit what this does when error tracking is in place
        console.error('captured error: ', err);
      }
    });
}

export var renderer = {
  init: init
};
