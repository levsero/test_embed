import { updateAcknowledged } from 'classicSrc/redux/modules/customerProvidedPrefill/actions'
import {
  getLastUpdateAcknowledged,
  getLastTimestamp,
  getValues,
} from 'classicSrc/redux/modules/customerProvidedPrefill/selectors'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useOnChange = (type, id, callback) => {
  const dispatch = useDispatch()
  const lastTimestamp = useSelector((state) => getLastTimestamp(state, type))
  const lastUpdateAcknowledged = useSelector((state) => getLastUpdateAcknowledged(state, type, id))
  const values = useSelector((state) => getValues(state, type))

  useEffect(() => {
    if (lastTimestamp === lastUpdateAcknowledged) {
      return
    }

    callback(values)

    dispatch(updateAcknowledged(type, id, lastTimestamp))
  }, [callback, dispatch, lastTimestamp, lastUpdateAcknowledged])
}

export default useOnChange
