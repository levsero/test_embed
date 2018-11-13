import _ from 'lodash';
import { beacon } from 'service/beacon';

const blacklist = [
  'zE.identify',
  'webWidget.identify'
];

const tracker = {
  queue: []
};

tracker.send = false;

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
    } else if (methodArgs.length === 0) {
      methodArgs = null;
    }

    beacon.trackUserAction('api', name, null, { args: methodArgs });
  }
};

tracker.addTo = function(object, prefix) {
  for (const name in object){
    const attr = object[name];

    if (_.isFunction(attr)){
      object[name] = this.getTrackableFunction(attr, `${prefix}.${name}`, object);
    }
  }
};

tracker.enqueue = function(name, ...args) {
  this.queue.push({ name, args });
};

tracker.flush = function() {
  _.forEach(this.queue, (item) => {
    this.track(item.name, ...item.args);
  });
  this.queue = [];
};

export default tracker;
