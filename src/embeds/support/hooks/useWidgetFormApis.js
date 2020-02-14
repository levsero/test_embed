import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLastFormPrefillId, getPrefillId, getPrefillValues } from 'embeds/support/selectors'
import { useForm } from 'react-final-form'
import { formPrefilled } from 'embeds/support/actions'
import { onNextTick } from 'utility/utils'
import useOnClear from 'embeds/webWidget/hooks/useOnClear'

const useWidgetFormApis = formId => {
  const form = useForm()
  const prefillId = useSelector(getPrefillId)
  const lastPrefill = useSelector(state => getLastFormPrefillId(state, formId))
  const prefillValues = useSelector(getPrefillValues(formId))
  const dispatch = useDispatch()

  const onClear = useCallback(() => {
    form.reset({})
  }, [form])
  useOnClear(onClear)

  useEffect(() => {
    if (lastPrefill === prefillId) {
      return
    }

    // React final form seems to have a bug where it doesn't update field elements if you update it too early
    // on first render.
    // To get around this, we just update it on next tick
    onNextTick(() => {
      form.batch(() => {
        Object.keys(prefillValues).forEach(key => {
          form.change(key, prefillValues[key])
        })
      })

      dispatch(formPrefilled(formId, prefillId))
    })
  }, [form, prefillId, prefillValues, lastPrefill, dispatch, formId])
}

export default useWidgetFormApis
