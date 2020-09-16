import { useEffect, useState } from 'react'

const useParseTime = timeReceived => {
  const [output, setOutput] = useState('Just now')
  const correctReceived = timeReceived * 1000

  useEffect(() => {
    const calculate = () => {
      const currentTime = new Date()
      const diffMs = currentTime - correctReceived

      if (diffMs < 60000) {
        setOutput('Just now')
        return
      }

      const date = new Date(correctReceived)

      setOutput(`${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`)
    }

    calculate()

    const intervalId = setInterval(() => calculate(), 30000)

    return () => clearInterval(intervalId)
  }, [timeReceived])

  return output
}

export default useParseTime
