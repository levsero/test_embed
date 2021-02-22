import { useEffect, useState } from 'react'
import useLabels from 'src/hooks/useLabels'

const sixtySecondsInMilliseconds = 60000

const getLabel = (receivedInSeconds, receivedRecentlyLabel, formatTimestamp) => {
  const receivedInMilliseconds = receivedInSeconds * 1000

  const diffMs = Date.now() - receivedInMilliseconds

  if (diffMs < sixtySecondsInMilliseconds) {
    return receivedRecentlyLabel
  }

  return formatTimestamp(receivedInMilliseconds)
}

const useParseTime = (timeReceivedInSeconds) => {
  const { formatTimestamp, receipts } = useLabels()
  const [output, setOutput] = useState(
    getLabel(timeReceivedInSeconds, receipts.receivedRecently, formatTimestamp)
  )

  useEffect(() => {
    const currentTime = Date.now()
    const receivedInMilliseconds = timeReceivedInSeconds * 1000

    const millisecondsAgoMessageWasSent = currentTime - receivedInMilliseconds

    // If the timestamp is less than 60 seconds, create a timeout to fire that updates
    // it to a regular timestamp instead of showing something like "Just now"
    if (millisecondsAgoMessageWasSent < sixtySecondsInMilliseconds) {
      const millisecondsUntilUpdateLabel =
        sixtySecondsInMilliseconds - millisecondsAgoMessageWasSent + 5

      const timeoutId = setTimeout(() => {
        setOutput(getLabel(timeReceivedInSeconds, receipts.receivedRecently, formatTimestamp))
      }, millisecondsUntilUpdateLabel)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [timeReceivedInSeconds, receipts.receivedRecently, formatTimestamp])

  return output
}

export default useParseTime
