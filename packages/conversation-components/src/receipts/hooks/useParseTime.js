import { useEffect, useState } from 'react'
import useLabels from 'src/hooks/useLabels'

const useParseTime = timeReceived => {
  const labels = useLabels()
  const [output, setOutput] = useState(labels.receiptReceivedRecently)
  const correctReceived = timeReceived * 1000

  useEffect(() => {
    const calculate = () => {
      const currentTime = new Date()
      const diffMs = currentTime - correctReceived

      if (diffMs < 60000) {
        setOutput(labels.receiptReceivedRecently)
        return
      }

      const date = new Date(correctReceived)

      setOutput(`${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`)
    }

    calculate()

    const intervalId = setInterval(() => calculate(), 60000)

    return () => clearInterval(intervalId)
  }, [timeReceived])

  return output
}

export default useParseTime
