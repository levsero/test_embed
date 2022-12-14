import _ from 'lodash'
import { beacon } from 'src/beacon'

const blacklist = ['zE.identify', 'webWidget.identify']

const tracker = {
  queue: [],
}

tracker.send = false

tracker.suspend = function (cb) {
  const oldSend = this.send,
    oldQueue = this.queue

  this.queue = []
  this.send = false
  cb()
  this.send = oldSend
  this.queue = oldQueue
}

tracker.getTrackableFunction = function (func, name, that) {
  return function () {
    tracker.track(name, ...arguments)
    return func.apply(that, arguments)
  }
}

tracker.track = function (name, ...args) {
  if (!this.send) {
    this.enqueue(name, ...args)
  }
  if (tracker.send && !_.includes(blacklist, name)) {
    let methodArgs = _.map(args, (arg) => (_.isFunction(arg) ? '<callback function>' : arg))

    if (methodArgs.length === 1) {
      methodArgs = methodArgs[0]
    } else if (methodArgs.length === 0) {
      methodArgs = null
    }

    beacon.trackUserAction('api', name, {
      value: { args: methodArgs },
    })
  }
}

tracker.addToMethod = function (object, name, trackingKey) {
  const attr = object[name]

  if (_.isFunction(attr)) {
    object[name] = this.getTrackableFunction(attr, trackingKey, object)
  }
}

tracker.addTo = function (object, prefix) {
  for (const name in object) {
    tracker.addToMethod(object, name, `${prefix}.${name}`)
  }
}

tracker.enqueue = function (name, ...args) {
  this.queue.push({ name, args })
}

tracker.flush = function () {
  _.forEach(this.queue, (item) => {
    this.track(item.name, ...item.args)
  })
  this.queue = []
}

tracker.init = function () {
  this.send = true
  this.flush()
}

export default tracker
