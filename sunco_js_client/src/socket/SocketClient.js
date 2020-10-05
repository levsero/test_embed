import { Client, Scheduler as FayeScheduler } from 'faye'
import ObserverList from '../utils/ObserverList'

// See "Advanced customisations" section here: https://faye.jcoglan.com/browser/dispatch.html

// Temp dev logging
// Faye.logger = window.console
const log = _message => {
  // console.log(message)
}

const getSchedulerClass = ({ socketClient, retryInterval = 15, maxConnectionAttempts = 5 }) => {
  return class Scheduler extends FayeScheduler {
    constructor(...args) {
      super(...args)
      this.client = socketClient
      this.attempts = 0
    }

    getInterval() {
      return retryInterval
    }

    succeed() {
      log('scheduler succeed CONNECTED')
    }

    fail() {
      log('scheduler fail DISCONNECTED')
    }

    isDeliverable() {
      // Prevent a loss of internet connectivity from exhausting retry attempts
      // Note that navigator.onLine may not work in Opera or Android WebViews
      // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine#Browser_compatibility
      if (navigator.onLine === false) {
        this.attempts = 0
        return true
      }

      const isDeliverable = super.isDeliverable()

      if (!isDeliverable) {
        log('scheduler isDeliverable DISCONNECTED 1')
        return false
      }

      const { channel } = this.message

      log('scheduler isDeliverable: channel', channel)
      log('scheduler isDeliverable: channel', this.message)
      // target only setup messages
      if (['/meta/handshake', '/meta/connect', '/meta/subscribe'].includes(channel)) {
        const shouldRetry = this.attempts < maxConnectionAttempts

        if (!shouldRetry) {
          log('scheduler isDeliverable DISCONNECTED 2')
        }

        return shouldRetry
      }

      return true
    }
  }
}

const SocketClient = function({ baseUrl, appId, appUserId, sessionToken } = {}) {
  this.appId = appId
  this.appUserId = appUserId
  this.sessionToken = sessionToken
  this.fayeClient = new Client(baseUrl, {
    scheduler: getSchedulerClass({ socketClient: this })
  })

  this.fayeClient.addExtension({
    outgoing: (message, callback) => {
      if (message.channel === '/meta/subscribe') {
        message.ext = {
          appUserId: this.appUserId,
          appId: this.appId
        }
        // if (auth.jwt) {
        //   message.ext.jwt = auth.jwt;
        // } else if (auth.sessionToken) {
        message.ext.sessionToken = this.sessionToken
        // }
      }

      callback(message)
    }
  })

  this.eventObservers = {
    connected: new ObserverList(),
    disconnected: new ObserverList(),
    message: new ObserverList()
  }

  const addObserver = (eventType, callback) => {
    this.eventObservers[eventType].addObserver(callback)
  }

  this.fayeClient.on('transport:down', () => {
    this.eventObservers['disconnected'].notify()
  })

  this.fayeClient.on('transport:up', () => {
    this.eventObservers['connected'].notify()
  })

  const subscribe = callback => {
    this.fayeClient.subscribe.call(
      this.fayeClient,
      `/apps/${this.appId}/appusers/${this.appUserId}`,
      ({ events }) => {
        for (const event of events) {
          callback(event)
        }
      }
    )
  }

  return {
    on: addObserver,
    // subscribe: (...args) => this.fayeClient.subscribe.call(this.fayeClient, ...args)
    subscribe
  }
}

export default SocketClient
