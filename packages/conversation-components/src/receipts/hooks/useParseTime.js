import { useEffect, useState } from 'react'
import useLabels from 'src/hooks/useLabels'

export const parseTimestamp = (timestamp, overrideDate = null) => {
  const currentDate = overrideDate ? new Date(overrideDate) : new Date()
  const messageDate = new Date(timestamp)

  const isToday =
    messageDate.getDate() === currentDate.getDate() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getFullYear() === currentDate.getFullYear()

  return `${messageDate.toLocaleString('en-US', {
    ...(isToday ? {} : { month: 'long', day: 'numeric' }),
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })}`
}

const useParseTime = timeReceived => {
  const labels = useLabels().receipts
  const [output, setOutput] = useState(labels.receivedRecently)
  const correctReceived = timeReceived * 1000

  useEffect(() => {
    const calculate = () => {
      const currentTime = new Date()
      const diffMs = currentTime - correctReceived

      if (diffMs < 60000) {
        setOutput(labels.receivedRecently)
        return
      }

      setOutput(parseTimestamp(correctReceived))
    }

    calculate()

    const intervalId = setInterval(() => calculate(), 60000)

    return () => clearInterval(intervalId)
  }, [timeReceived, labels.receivedRecently])

  return output
}

export default useParseTime
