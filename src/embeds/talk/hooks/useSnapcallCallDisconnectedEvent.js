import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { snapcallCallDisconnected } from 'embeds/talk/actions'
import { snapcallAPI } from 'snapcall'

const useSnapcallCallDisconnectedEvent = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const callbackFunction = () => {
      snapcallAPI.endCall()
      dispatch(snapcallCallDisconnected())
    }

    window.addEventListener('snapcallEvent_callDisconnect', callbackFunction)

    return () => {
      window.removeEventListener('snapcallEvent_callDisconnect', callbackFunction)
    }
  }, [dispatch])
}

export default useSnapcallCallDisconnectedEvent
