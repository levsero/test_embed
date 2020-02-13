import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import transformTime from 'src/embeds/talk/hooks/useTransformTime'
import { snapcallTimerUpdated } from 'embeds/talk/actions'

const useSnapcallUpdateTime = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const setFunc = e => {
      const callTime = transformTime(e.detail.data.time)

      dispatch(snapcallTimerUpdated(callTime))
    }

    window.addEventListener('snapcallEvent_callCurrentTimer', setFunc)
    return () => {
      window.removeEventListener('snapcallEvent_callCurrentTimer', setFunc)
    }
  }, [dispatch])
}

export default useSnapcallUpdateTime
