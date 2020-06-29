import { useState, useEffect, useRef } from 'react'

// Sometimes we need to set state after some asynchronous function has completed
// When this happens, there is a risk that the component has unmounted before setState is called
//
// For most cases you should cancel the promise or handle not updating the state locally.
// For all other cases where this isn't possible, this hook will safely protect you from updating
// a component after it has unmounted
const useSafeState = initialState => {
  const isMounted = useRef(true)
  const [state, setState] = useState(initialState)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const wrappedSetState = value => {
    if (isMounted.current) {
      setState(value)
    }
  }

  return [state, wrappedSetState]
}

export default useSafeState
