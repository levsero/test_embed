import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const useOnClear = (callback) => {
  const lastClearFormTimestamp = useSelector((state) => state.webWidget.clearFormTimestamp)
  const currentClearFormTimestamp = useRef(lastClearFormTimestamp)

  useEffect(() => {
    if (lastClearFormTimestamp > currentClearFormTimestamp.current) {
      callback()
    }
  }, [callback, lastClearFormTimestamp, currentClearFormTimestamp])
}

export default useOnClear
