import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { snapcallCallEnded } from 'embeds/talk/actions'

const useSnapcallCallEndedEvent = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const callbackFunction = () => {
      dispatch(snapcallCallEnded())
    }

    window.addEventListener('snapcallEvent_callEnd', callbackFunction)

    return () => {
      window.removeEventListener('snapcallEvent_callEnd', callbackFunction)
    }
  }, [dispatch])
}

export default useSnapcallCallEndedEvent
