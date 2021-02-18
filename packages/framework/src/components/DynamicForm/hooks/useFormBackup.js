import { useDispatch } from 'react-redux'
import { useForm } from 'react-final-form'
import { useEffect } from 'react'
import { setFormState } from 'src/redux/modules/form/actions'

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
