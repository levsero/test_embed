import { Client, Scheduler as FayeScheduler } from 'faye'
import SuncoAPIError from 'src/utils/SuncoAPIError'
import ObserverList from '../utils/ObserverList'
import { onBrowserComingBackOnline, onBrowserTabFocus, isBrowserOnline } from '../utils/browser'

// See "Advanced customisations" section here: https://faye.jcoglan.com/browser/dispatch.html

// Temp dev logging
// Faye.logger = window.console
const log = (..._args) => {
  // console.log(..._args)
}

const defaultOptions = {
  retryInterval: 15,
  maxConnectionAttempts: 5,
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

const SocketClient = function ({ baseUrl, appId, user } = {}) {
  this.appId = appId
  this.hasSocketAborted = false
  this.subscriptions = {}
  this.user = user

  const setupFayeClient = () => {
    const fayeClient = new Client(baseUrl, {
      scheduler: getSchedulerClass({ socketClient: this }),
    })

    fayeClient.addExtension({
      outgoing: (message, callback) => {
        if (message.channel === '/meta/subscribe') {
          const { jwt, sessionToken, appUserId } = user.getCurrentAppUserIfAny()

          message.ext = {
            appUserId,
            appId: this.appId,
          }

          if (jwt) {
            message.ext.jwt = jwt
          } else if (sessionToken) {
            message.ext.sessionToken = sessionToken
          }
        }

        callback(message)
      },
      incoming: (message, request, callback) => {
        if (message.channel === '/meta/subscribe') {
          this.eventObservers['subscription'].notify({ successful: message.successful })
        }

        callback(message)
      },
    })

    fayeClient.on('transport:down', () => {
      this.eventObservers['disconnected'].notify()
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
    subscription: new ObserverList(),
  }

  this.triggerSocketAborted = () => {
    this.hasSocketAborted = true
    this.eventObservers['aborted'].notify()
  }

  const addObserver = (eventType, callback) => {
    this.eventObservers[eventType].addObserver(callback)
    return () => {
      this.eventObservers[eventType].removeObserver(callback)
    }
  }

  const subscribe = () => {
    // If its already subscribed, resolve immediately
    const { appUserId } = this.user.getCurrentAppUserIfAny()
    const channel = `/sdk/apps/${this.appId}/appusers/${appUserId}`

    if (this.subscriptions[channel]) {
      return new Promise((res) => res())
    }

    return new Promise((resolve, reject) => {
      let reattemptCount = 0
      let cancelled = false

      this.cancelPendingSubscription = () => {
        reject(new SuncoAPIError('Subscription cancelled', { subscriptionCancelled: true }))
        cancelled = true
        this.cancelPendingSubscription = null
      }

      const subscribeToChannel = () => {
        if (cancelled) {
          return
        }
        this.subscription = this.fayeClient
          .subscribe(channel, ({ events }) => {
            if (cancelled) {
              return
            }
            for (const event of events) {
              switch (event.type) {
                case 'message':
                  this.eventObservers['message'].notify(event.message)
                  break
                case 'activity':
                  this.eventObservers['activity'].notify(event.activity)
                  break
                case 'link:cancelled':
                case 'link:failed':
                case 'link:matched':
                case 'link':
                  this.eventObservers['link'].notify(event)
                  break
              }
            }
          })
          .then(
            () => {
              if (cancelled) {
                return
              }
              resolve()
            },
            (err) => {
              if (cancelled) {
                return
              }

              const { retryInterval, maxConnectionAttempts } = defaultOptions
              const canReattempt =
                reattemptCount < maxConnectionAttempts - 1 &&
                err.code === 401 &&
                err.message === 'Unknown client'

              if (!canReattempt) {
                reject(
                  new SuncoAPIError('Subscription was not successful', {
                    subscriptionError: err,
                    reattemptCount,
                  })
                )
                return
              }

              const delay = reattemptCount === 0 ? 0 : retryInterval * 1000

              reattemptCount += 1
              setTimeout(subscribeToChannel, delay)
            }
          )
      }

      subscribeToChannel()
    })
  }

  const unsubscribe = () => {
    this.subscription?.cancel?.()
    this.cancelPendingSubscription?.()
  }

  return {
    on: addObserver,
    subscribe: () => subscribe.call(this),
    unsubscribe: () => unsubscribe.call(this),
  }
}

export default SocketClient
