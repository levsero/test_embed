import errorTracker from 'src/framework/services/errorTracker'
import { getAllMessages } from 'messengerSrc/features/messageLog/store'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'

const beginRace = (store) => {
  const messageReceivedPromise = new Promise((resolve) => {
    if (getAllMessages(store.getState()).length > 0) {
      resolve({ success: true })
      return
    }

    const unsubscribe = store.subscribe(() => {
      if (getAllMessages(store.getState()).length > 0) {
        resolve({ success: true })
        unsubscribe()
      }
    })
  })

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: false })
    }, 5000)
  })

  return Promise.race([messageReceivedPromise, timeoutPromise]).then(({ success }) => {
    if (!success) {
      errorTracker.error(new Error('Failed to receive any messages after Web Widget was opened'))
    }
  })
}

const trackNoMessageReceived = (store) => {
  return new Promise((resolve) => {
    if (getIsWidgetOpen(store.getState())) {
      beginRace(store).then(resolve)
      return
    }

    const unsubscribe = store.subscribe(() => {
      if (getIsWidgetOpen(store.getState())) {
        beginRace(store).then(resolve)
        unsubscribe()
      }
    })
  })
}

export default trackNoMessageReceived
