import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { snapcallCallStarted } from 'embeds/talk/actions'

const useSnapcallCallStartingEvent = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const callbackFunction = () => {
      dispatch(snapcallCallStarted())
    }

    window.addEventListener('snapcallEvent_callStarting', callbackFunction)

    return () => {
      window.removeEventListener('snapcallEvent_callStarting', callbackFunction)
    }
  }, [dispatch])
}

export default useSnapcallCallStartingEvent
