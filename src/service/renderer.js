import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher } from 'embed/launcher/launcher';
require('imports?_=lodash!lodash');

var embedsMap = {
  'submitTicket': submitTicket,
  'launcher': launcher
};

function parseConfig(config) {
  var rendererConfig = _.clone(config, true);

  _.forEach(rendererConfig, function(configItem) {
    if(configItem.props) {
      configItem.props = _.reduce(configItem.props, function(result, value, key) {
        if(_.isObject(value)) {
          result[key] = function() {
            embedsMap[config[value.name].embed][value.method](value.name);
          };
        } else {
          result[key] = value;
        }
        return result;
      }, {});
    }
  });

  return rendererConfig;
}

export var renderer = {
  init: function(config) {
    var parsedConfig = parseConfig(config);

    _.forEach(parsedConfig, function(configItem, embedName) {
      try {
        embedsMap[configItem.embed].create(embedName, configItem.props || {});
        embedsMap[configItem.embed].render(embedName);
      } catch (err) {
        // TODO: revisit what this does when error tracking is in place
        //console.error('captured error: ', err);
      }
    });
  }
};
