import { getAllMessages } from 'src/apps/messenger/features/messageLog/store'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import errorTracker from 'src/framework/services/errorTracker'

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
    }, 3000)
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
