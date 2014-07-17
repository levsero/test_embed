import { submitTicket } from 'embed/submitTicket/submitTicket';
import { launcher     } from 'embed/launcher/launcher';
import { helpCenter   } from 'embed/helpCenter/helpCenter';
require('imports?_=lodash!lodash');

var embedsMap = {
      'submitTicket': submitTicket,
      'launcher':     launcher,
      'helpCenter':   helpCenter
    },
    initialised = false;

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
        // TODO: revisit what this does when error tracking is in place
        console.error(
          'captured error: ',
          {
            embedName: embedName,
            configItem: configItem,
            err: err
          }
        );
      }
    });
  }

  initialised = true;
}

export var renderer = {
  init: init
};
