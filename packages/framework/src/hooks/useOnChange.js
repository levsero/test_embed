import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateAcknowledged } from 'src/redux/modules/customerProvidedPrefill/actions'
import {
  getLastUpdateAcknowledged,
  getLastTimestamp,
  getValues,
} from 'src/redux/modules/customerProvidedPrefill/selectors'

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
