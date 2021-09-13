const fifteenMinutes = 60 * 15

const createTimestamp = (message) => {
  return {
    type: 'timestamp',
    received: message.received,
    _id: `timestamp_${message.received}`,
    isLocalMessageType: true,
  }
}

const insertTimestampsInLog = (log) => {
  let previousTimestamp = 0
  const timestampedLog = []
  log.forEach((message) => {
    if (message.received - previousTimestamp > fifteenMinutes) {
      timestampedLog.push(createTimestamp(message))
    }
    previousTimestamp = message.received
    timestampedLog.push(message)
  })

  return timestampedLog
}

export default insertTimestampsInLog
