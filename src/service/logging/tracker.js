import _ from 'lodash';
import { beacon } from 'service/beacon';

const blacklist = [
  'zE.identify',
  'webWidget.identify'
];

const tracker = {};

tracker.send = !__DEV__;

tracker.getTrackableFunction = function(func, name, that) {
  return function() {
    tracker.track(name, ...arguments);
    return func.apply(that, arguments);
  };
};

tracker.track = function(name, ...args) {
  if (tracker.send && !_.includes(blacklist, name)) {
    let methodArgs = _.map(args, (arg) => _.isFunction(arg) ? '<callback function>' : arg);

    if (methodArgs.length === 1) {
      methodArgs = methodArgs[0];
    }

    beacon.trackUserAction('api', name, null, { args: methodArgs });
  }
};

tracker.addTo = function(object, prefix) {
  for (const name in object){
    const attr = object[name];

    if (_.isFunction(attr)){
      object[name] = tracker.getTrackableFunction(attr, `${prefix}.${name}`, object);
    }
  }
};

export default tracker;
