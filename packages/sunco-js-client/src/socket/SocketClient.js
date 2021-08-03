import { Client, Scheduler as FayeScheduler } from 'faye'
import ObserverList from '../utils/ObserverList'
import { onBrowserComingBackOnline, onBrowserTabFocus, isBrowserOnline } from '../utils/browser'

// See "Advanced customisations" section here: https://faye.jcoglan.com/browser/dispatch.html

// Temp dev logging
// Faye.logger = window.console
const log = (..._args) => {
  // console.log(..._args)
}

const getSchedulerClass = ({ socketClient, retryInterval = 15, maxConnectionAttempts = 5 }) => {
  return class Scheduler extends FayeScheduler {
    constructor(...args) {
      super(...args)
      this.socketClient = socketClient
      this.attempts = 0
    }

    getInterval() {
      return retryInterval
    }

    succeed() {
      log('scheduler succeed CONNECTED')
    }

    fail() {
      log('scheduler fail DISCONNECTED - will retry')
    }

    abort() {
      log('scheduler ABORTED - is not going to retry again')
      this.socketClient.triggerSocketAborted()
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

      // Don't endlessly retry connection attempts when the details are incorrect
      if (
        channel &&
        ['/meta/handshake', '/meta/connect', '/meta/disconnect', '/meta/subscribe'].includes(
          channel
        )
      ) {
        const shouldRetry = this.attempts < maxConnectionAttempts

        if (!shouldRetry) {
          log('scheduler isDeliverable DISCONNECTED - too many failed retries')
        }

        return shouldRetry
      }

      return true
    }
  }
}

const SocketClient = function ({ baseUrl, appId, appUserId, sessionToken } = {}) {
  this.appId = appId
  this.appUserId = appUserId
  this.sessionToken = sessionToken
  this.hasSocketAborted = false

  const setupFayeClient = () => {
    const fayeClient = new Client(baseUrl, {
      scheduler: getSchedulerClass({ socketClient: this }),
    })

    fayeClient.addExtension({
      outgoing: (message, callback) => {
        if (message.channel === '/meta/subscribe') {
          message.ext = {
            appUserId: this.appUserId,
            appId: this.appId,
          }
          // if (auth.jwt) {
          //   message.ext.jwt = auth.jwt;
          // } else if (auth.sessionToken) {
          message.ext.sessionToken = this.sessionToken
          // }
        }

        callback(message)
      },
    })

    fayeClient.on('transport:down', () => {
      this.eventObservers['disconnected'].notify()
    })

    fayeClient.on('transport:up', () => {
      this.eventObservers['connected'].notify()
    })

    return fayeClient
  }

  this.fayeClient = setupFayeClient()

  this.refreshFayeSocketIfNeeded = () => {
    if (this.hasSocketAborted && isBrowserOnline()) {
      this.fayeClient.disconnect()
      this.fayeClient = setupFayeClient()
      this.hasSocketAborted = false
      subscribe.call(this)
    }
  }

  onBrowserComingBackOnline(this.refreshFayeSocketIfNeeded)
  onBrowserTabFocus(this.refreshFayeSocketIfNeeded)

  this.eventObservers = {
    connected: new ObserverList(),
    disconnected: new ObserverList(),
    aborted: new ObserverList(),
    message: new ObserverList(),
    activity: new ObserverList(),
    link: new ObserverList(),
  }

  this.triggerSocketAborted = () => {
    this.hasSocketAborted = true
    this.eventObservers['aborted'].notify()
  }

  const addObserver = (eventType, callback) => {
    this.eventObservers[eventType].addObserver(callback)
  }

  const subscribe = () => {
    this.subscription = this.fayeClient.subscribe.call(
      this.fayeClient,
      `/sdk/apps/${this.appId}/appusers/${this.appUserId}`,
      ({ events }) => {
        for (const event of events) {
          switch (event.type) {
            case 'message':
              this.eventObservers['message'].notify(event.message)
              break
            case 'activity':
              this.eventObservers['activity'].notify(event.activity)
              break
            case 'link':
              this.eventObservers['link'].notify(event)
              break
          }
        }
      }
    )
  }

  const unsubscribe = () => {
    this.subscription?.cancel()
  }

  return {
    on: addObserver,
    subscribe: () => subscribe.call(this),
    unsubscribe: () => unsubscribe.call(this),
  }
}

export default SocketClient
