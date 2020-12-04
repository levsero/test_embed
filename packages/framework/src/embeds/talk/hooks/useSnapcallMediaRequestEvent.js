import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { snapcallMediaRequestFailed } from 'src/embeds/talk/actions'

const useSnapcallMediaRequestEvent = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const callbackFunction = e => {
      if (e.detail.data.success === false) {
        dispatch(snapcallMediaRequestFailed())
      }
    }

    window.addEventListener('snapcallEvent_mediaRequest', callbackFunction)

    return () => {
      window.removeEventListener('snapcallEvent_mediaRequest', callbackFunction)
    }
  }, [dispatch])
}

export default useSnapcallMediaRequestEvent
