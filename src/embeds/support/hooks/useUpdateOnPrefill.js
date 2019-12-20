import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getLastPrefillTimestamp, getPrefillValues } from 'embeds/support/selectors'
import { useForm } from 'react-final-form'

const useUpdateOnPrefill = () => {
  const form = useForm()
  const lastUpdate = useRef(Date.now())
  const prefillValues = useSelector(getPrefillValues)
  const prefillTimestamp = useSelector(getLastPrefillTimestamp)

  useEffect(() => {
    if (lastUpdate.current >= prefillTimestamp) {
      return
    }

    form.batch(() => {
      Object.keys(prefillValues).forEach(key => {
        form.change(key, prefillValues[key])
      })
    })
    lastUpdate.current = prefillTimestamp
  }, [form, prefillTimestamp, prefillValues])
}

export default useUpdateOnPrefill
