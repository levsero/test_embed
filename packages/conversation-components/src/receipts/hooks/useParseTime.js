import { useEffect, useState } from 'react'
import useLabels from 'src/hooks/useLabels'

const useParseTime = (timeReceived) => {
  const { labels, formatTimestamp } = useLabels()
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

      setOutput(formatTimestamp(correctReceived))
    }

    calculate()

    const intervalId = setInterval(() => calculate(), 60000)

    return () => clearInterval(intervalId)
  }, [timeReceived, labels.receivedRecently])

  return output
}

export default useParseTime
