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
    beacon.trackUserAction('api', name, null, { args: args });
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
