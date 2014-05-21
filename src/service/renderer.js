import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher } from 'embed/launcher/launcher';
require('imports?_=lodash!lodash');

var embedsMap = {
  'submitTicket': submitTicket,
  'launcher': launcher
};

export var renderer = {
  init: function(config) {
    _.forEach(config, function(configItem, embedName) {
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

      embedsMap[configItem.embed].create(embedName, configItem.props || {});
      embedsMap[configItem.embed].render(embedName);
    });
  }
};
