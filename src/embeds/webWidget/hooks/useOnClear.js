import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const useOnClear = cb => {
  const lastClearForm = useSelector(state => state.webWidget.clearFormTimestamp)
  const currentClearForm = useRef(lastClearForm)

  // We keep a ref to the callback so changing the callback doesn't cause the useEffect to trigger
  const callback = useRef(cb)

  callback.current = cb

  useEffect(() => {
    if (lastClearForm > currentClearForm.current) {
      callback.current()
      currentClearForm.current = lastClearForm
    }
  }, [lastClearForm, currentClearForm])
}

export default useOnClear
