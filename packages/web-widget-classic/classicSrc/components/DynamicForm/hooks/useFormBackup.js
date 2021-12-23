import { setFormState } from 'classicSrc/redux/modules/form/actions'
import { useEffect } from 'react'
import { useForm } from 'react-final-form'
import { useDispatch } from 'react-redux'

const useFormBackup = (formId) => {
  const dispatch = useDispatch()
  const form = useForm()

  useEffect(() => {
    return () => {
      dispatch(setFormState(formId, form.getState().values))
    }
  }, [form, dispatch, formId])
}

export default useFormBackup
