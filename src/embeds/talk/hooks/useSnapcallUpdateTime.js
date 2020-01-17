import { useEffect, useState } from 'react'
import transformTime from 'src/embeds/talk/hooks/useTransformTime'

const useSnapcallUpdateTime = () => {
  const [callTime, setCallTime] = useState(0)

  useEffect(() => {
    const setFunc = e => {
      setCallTime(e.detail.data.time)
    }

    window.addEventListener('snapcallEvent_callCurrentTimer', setFunc)
    return () => {
      window.removeEventListener('snapcallEvent_callCurrentTimer', setFunc)
    }
  }, [])

  return transformTime(callTime)
}

export default useSnapcallUpdateTime
