const fifteenMinutes = 60 * 15

const createTimestamp = (message) => {
  const correctedMessageReceived = message.received * 1000
  return {
    type: 'timestamp',
    received: correctedMessageReceived,
    _id: `timestamp_${correctedMessageReceived}`,
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
